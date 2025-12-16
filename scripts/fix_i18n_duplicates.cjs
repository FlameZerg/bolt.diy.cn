const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/utils/i18n.ts');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

// 定义区域
// 简单假设：第一次出现 'en: {' 开始 en 区，直到匹配的 '}'
// 然后 'zh: {' 开始 zh 区，直到匹配的 '}'
// 注意：这依赖于文件格式比较标准

function getSectionRange(lines, startMarker) {
    const start = lines.findIndex(line => line.trim().startsWith(startMarker));
    if (start === -1) return null;

    let braceCount = 0;
    let end = -1;
    let foundStart = false;

    for (let i = start; i < lines.length; i++) {
        const line = lines[i];
        // 统计括号
        // 这里做一个简化假设：en: { 是开始，braceCount 从 0 -> 1
        const openMatches = (line.match(/\{/g) || []).length;
        const closeMatches = (line.match(/\}/g) || []).length;

        if (!foundStart) {
            braceCount += openMatches;
            if (braceCount > 0) foundStart = true;
        } else {
            braceCount += openMatches;
        }

        if (foundStart) {
            braceCount -= closeMatches;
            if (braceCount === 0) {
                end = i;
                break;
            }
        }
    }
    return { start, end };
}

const enRange = getSectionRange(lines, 'en: {');
const zhRange = getSectionRange(lines, 'zh: {');

if (!enRange || !zhRange) {
    console.error('Could not find en or zh sections.');
    process.exit(1);
}

const linesToDelete = new Set();
const duplicateKeys = []; // 记录用于报告

function scanDuplicates(start, end, sectionName) {
    const keys = new Map(); // key -> lineIndex
    for (let i = start + 1; i < end; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed === '') continue;

        const match = trimmed.match(/^([a-zA-Z0-9_]+):/);
        if (match) {
            const key = match[1];
            if (keys.has(key)) {
                // 发现重复，标记当前行删除（保留之前的）
                linesToDelete.add(i);
                duplicateKeys.push({ key, section: sectionName, line: i + 1, original: keys.get(key) + 1 });
            } else {
                keys.set(key, i);
            }
        }
    }
}

scanDuplicates(enRange.start, enRange.end, 'en');
scanDuplicates(zhRange.start, zhRange.end, 'zh');

if (linesToDelete.size === 0) {
    console.log('No duplicates found.');
} else {
    console.log(`Found ${linesToDelete.size} duplicates. Deleting...`);
    duplicateKeys.forEach(d => {
        console.log(`Deleting ${d.section} key '${d.key}' at line ${d.line} (Duplicate of line ${d.original})`);
    });

    const newContent = lines.filter((_, index) => !linesToDelete.has(index)).join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('File updated successfully.');
}
