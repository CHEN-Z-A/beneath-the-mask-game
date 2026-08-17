# Scan Hint Consistency Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 让第三、第四关的扫描阶段与第一、第二关一致，明确显示铜镜当前指向的碎片名称。

**Architecture:** 保留现有扫描顺序、铜镜移动、错误反馈和后续自主拼合机制，只调整关卡数据中的 `scanConfig.revealTargetName`。通过数据校验锁定四关都必须提供明确目标名称，并提升 `data.js` 的缓存版本，确保 GitHub Pages 和 Cloud Studio 获取新配置。

**Tech Stack:** 原生 HTML、CSS、JavaScript；Node.js 数据校验；GitHub Pages；Cloud Studio。

---

### Task 1: 锁定四关扫描提示要求

**Files:**
- Modify: `js/_check_levels.js`
- Create: `js/_check_scan_hints.js`
- Test: `js/_check_levels.js`

**Step 1: Write the failing test**

在四关数据循环中增加断言：

```js
check(level.scanConfig?.revealTargetName === true, `${id} 扫描阶段必须显示当前目标碎片名称`);
```

**Step 2: Run test to verify it fails**

Run: `node js/_check_levels.js`

Expected: FAIL，并指出 `L03_smile` 与 `L04_silence` 未显示目标碎片名称。

### Task 2: 实施最小配置修复

**Files:**
- Modify: `js/data.js`
- Modify: `index.html`
- Modify: `VERSION.md`

**Step 1: Write minimal implementation**

将第三、第四关的 `scanConfig.revealTargetName` 改为 `true`；把 `index.html` 中 `data.js` 的查询版本从 `3.2` 升为 `3.3`；在版本记录中说明扫描提示一致性修复。

**Step 2: Run tests and verify**

Run:

```bash
node --check js/data.js
node --check js/game.js
node js/_check_levels.js
node js/_check_art.js
node js/_check_scan_hints.js
```

Expected: 全部通过。

**Step 3: Browser regression**

分别进入第三、第四关扫描阶段，确认首步和下一步提示显示具体碎片名称，铜镜仍按既定顺序移动，点错提示与收集流程正常。

**Step 4: Publish**

提交并推送 `main`，等待 GitHub Pages 部署成功；Cloud Studio 工作空间执行 `git pull` 后验证临时预览。
