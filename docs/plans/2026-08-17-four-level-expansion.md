# 《面具之下》四关扩展 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将当前单关体验扩展为四个完整、逐级提高难度的情绪理解关卡，并保证横屏网页中的大厅、扫描、拼合、翻面、仪式与复盘流程全部可用。

**Architecture:** 保持原生 HTML/CSS/JavaScript 单页结构，用 `js/data.js` 描述每关剧情、视觉、题目和反馈；`js/game.js` 只读取当前关卡配置，不再硬编码“国王/威严面具”；玩家进度以关卡 ID 去重保存，并根据已完成关卡解锁下一关。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、Web Audio API、Node.js 语法与数据校验、Playwright 浏览器验证。

---

## Task 1：建立四关数据契约与自动校验

**Files:**
- Create: `js/_check_levels.js`
- Modify: `js/data.js`

1. 校验关卡数量、ID、难度、六阶段配置、图片路径、推理题正确项和仪式题正确组合。
2. 为旧存档补充 `completedLevels`，保证升级后仍能读取。
3. 先运行校验暴露缺失字段，数据补齐后要求通过。

## Task 2：补充三关完整内容

**Files:**
- Modify: `js/data.js`

1. 第二关“纵目守望”：训练区分“盯视/严厉”与“警觉/保护”。
2. 第三关“含笑之勇”：训练理解微笑也可能承载紧张、责任与鼓励。
3. 第四关“无言之心”：训练理解沉默也可能来自过载、害怕或暂时难以表达。
4. 难度逐级增加：减少拼合提示、增加相近干扰项、提高仪式题精确匹配要求。
5. 所有虚构情境注明为教育性艺术想象，不作为三星堆历史事实陈述。

## Task 3：把流程改造成关卡通用引擎

**Files:**
- Modify: `js/game.js`

1. 大厅渲染四张关卡卡片和真实解锁状态。
2. 人物称谓、正反面图像、复原总结、内心独白、反馈语和最终洞察均从关卡数据读取。
3. 仪式题按配置精确判定，完成记录按关卡 ID 去重。
4. 复盘页“进入下一关”直接开启下一已解锁关卡；第四关完成后返回大厅。

## Task 4：增加四关主题视觉并保持横屏适配

**Files:**
- Modify: `css/style.css`
- Modify: `index.html`

1. 大厅采用 2×2 关卡卡片网格，在常见横屏尺寸内完整呈现。
2. 每关使用不同的青铜色调、光晕和人物图像滤镜，但共用统一组件。
3. 更新首页文案及静态资源版本号。

## Task 5：验证四关完整体验

**Files:**
- Verify: `index.html`, `js/data.js`, `js/game.js`, `css/style.css`

1. 运行 `node --check js/data.js`、`node --check js/game.js`、`node js/_check_levels.js`。
2. 以 1280×720 为主视口逐关走通六阶段，并检查 1024×600 与 1440×900。
3. 确认刷新后存档、重复通关计数、下一关解锁、错误答案重试和最终全通状态。
4. 确认控制台没有新的脚本错误或资源加载失败。
