import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

interface MobileMarkdownViewProps {
  content: string;
}

export const MobileMarkdownView: React.FC<MobileMarkdownViewProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (key: string) => {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      elements.push(
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          key={key}
          style={styles.tableScroll}
          contentContainerStyle={styles.tableContainer}
        >
          <View style={styles.table}>
            {tableHeader.length > 0 && (
              <View style={styles.tableHeaderRow}>
                {tableHeader.map((th, i) => (
                  <View key={i} style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.headerCellText}>{th.replace(/\*\*/g, '').trim()}</Text>
                  </View>
                ))}
              </View>
            )}
            {tableRows.map((row, rIdx) => (
              <View
                key={rIdx}
                style={[
                  styles.tableRow,
                  rIdx % 2 === 1 ? styles.tableRowAlt : null,
                  rIdx === tableRows.length - 1 ? styles.tableRowLast : null,
                ]}
              >
                {row.map((cell, cIdx) => (
                  <View key={cIdx} style={styles.tableCell}>
                    <Text style={styles.cellText}>{cell.replace(/\*\*/g, '').trim()}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
      tableHeader = [];
      tableRows = [];
    }
    inTable = false;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Table Row Detection: | Col 1 | Col 2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (trimmed.replace(/[\s|:-]/g, '').length === 0) {
        // separator row |---|---|
        continue;
      }
      const cols = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      if (!inTable) {
        inTable = true;
        tableHeader = cols;
      } else {
        tableRows.push(cols);
      }
      continue;
    } else if (inTable) {
      flushTable(`table-${idx}`);
    }

    // Headings (### or ####)
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <View key={idx} style={styles.heading4Box}>
          <View style={styles.dot} />
          <Text style={styles.heading4}>{trimmed.slice(5).replace(/\*\*/g, '')}</Text>
        </View>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <Text key={idx} style={styles.heading3}>
          {trimmed.slice(4).replace(/\*\*/g, '')}
        </Text>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <Text key={idx} style={styles.heading2}>
          {trimmed.slice(3).replace(/\*\*/g, '')}
        </Text>
      );
      continue;
    }

    // Blockquotes (> note)
    if (trimmed.startsWith('> ')) {
      elements.push(
        <View key={idx} style={styles.quoteBox}>
          <Text style={styles.quoteText}>{trimmed.slice(2).replace(/\*\*/g, '')}</Text>
        </View>
      );
      continue;
    }

    // List items (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <View key={idx} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{renderFormattedText(trimmed.slice(2))}</Text>
        </View>
      );
      continue;
    }

    // Numbered List Items
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      elements.push(
        <View key={idx} style={styles.bulletRow}>
          <Text style={styles.numberPrefix}>{olMatch[1]}.</Text>
          <Text style={styles.bulletText}>{renderFormattedText(olMatch[2])}</Text>
        </View>
      );
      continue;
    }

    // Spacer for empty lines
    if (!trimmed) {
      elements.push(<View key={idx} style={styles.spacer} />);
      continue;
    }

    // Standard paragraph
    elements.push(
      <Text key={idx} style={styles.paragraph}>
        {renderFormattedText(line)}
      </Text>
    );
  }

  if (inTable) flushTable('table-end');

  return <View style={styles.container}>{elements}</View>;
};

function renderFormattedText(text: string): React.ReactNode {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={styles.boldText}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  heading2: {
    fontSize: 15,
    fontWeight: '800',
    color: '#101226',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  heading3: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#101226',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  heading4Box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginBottom: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5B45F5',
  },
  heading4: {
    fontSize: 12,
    fontWeight: '700',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  paragraph: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingLeft: 4,
    marginVertical: 1.5,
  },
  bulletDot: {
    fontSize: 13,
    color: '#5B45F5',
    fontWeight: '900',
    lineHeight: 18,
  },
  numberPrefix: {
    fontSize: 11,
    color: '#5B45F5',
    fontWeight: '700',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  quoteBox: {
    backgroundColor: '#EEF2FF',
    borderLeftWidth: 3.5,
    borderLeftColor: '#6366F1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginVertical: 4,
  },
  quoteText: {
    fontSize: 11.5,
    color: '#312E81',
    lineHeight: 17,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  spacer: {
    height: 4,
  },
  tableScroll: {
    marginVertical: 6,
  },
  tableContainer: {
    paddingVertical: 2,
  },
  table: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCell: {
    minWidth: 120,
    maxWidth: 220,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  headerCell: {
    backgroundColor: '#F1F5F9',
  },
  headerCellText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  cellText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});
