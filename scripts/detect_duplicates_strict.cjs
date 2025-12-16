const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/utils/i18n.ts');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

const enStart = lines.findIndex(line => line.trim().startsWith('en: {'));
const zhStart = lines.findIndex(line => line.trim().startsWith('zh: {'));

// 简单的假设：en 块在 zh 块之前，且两个块都以 `},` 或 `}` 结束（需更复杂的解析，但对于此任务可能足够）
// 为了更准确，我们使用简单的基于缩进或括号计数的解析器，或者仅仅由行解析。
// 由于 i18n.ts 结构比较规范，我们尝试在 enStart 和 zhStart 之间找 en 的结束，在 zhStart 之后找 zh 的结束。

function findDuplicates(startLine, endLine, sectionName) {
    const keys = new Map();
    const duplicates = [];

    for (let i = startLine + 1; i < endLine; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 匹配 key: 'value', 格式
        // 忽略注释 //
        if (trimmed.startsWith('//') || trimmed === '') continue;

        // 简单的 key 匹配: word:
        const match = trimmed.match(/^([a-zA-Z0-9_]+):/);
        if (match) {
            const key = match[1];
            if (keys.has(key)) {
                duplicates.push({
                    key,
                    line: i + 1,
                    originalLine: keys.get(key),
                    content: line
                });
            } else {
                keys.set(key, i + 1);
            }
        }
    }
    return duplicates;
}

// 寻找 en 的结束
let enEnd = -1;
let braceCount = 1; // 始于 en: {
for (let i = enStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{')) braceCount++;
    if (line.includes('}')) braceCount--;
    if (braceCount === 0) {
        enEnd = i;
        break;
    }
}

// 寻找 zh 的结束
let zhEnd = -1;
braceCount = 1; // 始于 zh: {
for (let i = zhStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{')) braceCount++;
    if (line.includes('}')) braceCount--;
    if (braceCount === 0) {
        zhEnd = i;
        break;
    }
}

console.log(`Analyzing en section: Lines ${enStart + 1} - ${enEnd + 1}`);
const enDups = findDuplicates(enStart, enEnd, 'en');
console.log(`Found ${enDups.length} duplicates in 'en':`);
enDups.forEach(d => console.log(`  - ${d.key} (Line ${d.line}, first seen at Line ${d.originalLine})`));

console.log(`\nAnalyzing zh section: Lines ${zhStart + 1} - ${zhEnd + 1}`);
const zhDups = findDuplicates(zhStart, zhEnd, 'zh');
console.log(`Found ${zhDups.length} duplicates in 'zh':`);
zhDups.forEach(d => console.log(`  - ${d.key} (Line ${d.line}, first seen at Line ${d.originalLine})`));

// 输出完整的 JSON 结果供后续处理
const allDups = [...enDups, ...zhDups];
if (allDups.length > 0) {
    console.log('\nSuggested Actions: Delete the following lines?');
    // 倒序输出行号以方便删除
    allDups.sort((a, b) => b.line - a.line).forEach(d => {
        // console.log(`Delete Line ${d.line}: ${d.content.trim()}`);
    });
} else {
    console.log('\nNo duplicates found! The file is clean.');
}
