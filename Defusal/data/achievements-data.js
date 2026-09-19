// ===================================================================
// Achievement definitions
//
// Loaded as a plain <script> tag, same convention as the question
// bank files (identify-questions.js, module2-questions.js, etc.) -
// this file just needs to run before defusal.js and it hands off
// ACHIEVEMENT_REGISTRY as a global.
//
// Each achievement is checked against a `progress` snapshot built by
// defusal.js (see buildAchievementProgressSnapshot()). progress has
// this shape:
//
//   {
//     categoryStats: {
//       stack: { correct: 7, total: 8 },
//       queue: { correct: 3, total: 3 },
//       linkedList: { ... }, tree: { ... }, hash: { ... },
//       graph: { ... }, sorting: { ... }, array: { ... }
//     },
//     completedQuestionKeys: ["module3:ll-insert-01", "identify:ll-04", ...],
//     hasDefusedExpertBomb: false
//   }
//
// A question's own `category` field (in its data/*-questions.js
// entry) can be either a single string ("stack") or an array of
// strings (["stack", "queue"]) for a question that genuinely spans
// more than one structure - e.g. a Connect-the-Dots round whose pairs
// mix a stack operation with a queue operation. Answering it counts
// toward every category it's tagged with (see updateAchievementStats()
// in defusal.js).
//
// `check(progress, catalog)` returns true once the achievement should
// be considered unlocked. `catalog` is the read-only category ->
// full list of "moduleId:questionId" keys that exist across every
// question bank (see buildQuestionCatalog() in defusal.js) - it's
// what "complete ALL linked-list simulations" is measured against,
// since that requires knowing the denominator.
//
// Achievements are only ever evaluated outside practice mode - see
// updateAchievementStats()/updateBombLevelAchievementStats() in
// defusal.js, which simply never get called during a practice run.
// ===================================================================

const ACHIEVEMENT_REGISTRY = {
    stackSpecialist: {
        label: "Stack Specialist",
        description: "Complete 10 stack questions with \u2265 90% accuracy.",
        // Progress is shown on the Achievements screen as
        // "correct / target" while locked, e.g. "7 / 10".
        getProgressText: function (progress) {
            const stats = progress.categoryStats.stack;
            const total = stats ? stats.total : 0;
            return Math.min(total, 10) + " / 10 attempted";
        },
        check: function (progress) {
            const stats = progress.categoryStats.stack;
            if (!stats || stats.total < 10) {
                return false;
            }
            return (stats.correct / stats.total) >= 0.9;
        }
    },

    pointerTechnician: {
        label: "Pointer Technician",
        description: "Complete every linked-list question across the whole bomb.",
        getProgressText: function (progress, catalog) {
            const totalKeys = catalog.linkedList.length;
            const doneCount = catalog.linkedList.filter(function (key) {
                return progress.completedQuestionKeys.indexOf(key) !== -1;
            }).length;
            return doneCount + " / " + totalKeys + " questions";
        },
        check: function (progress, catalog) {
            if (!catalog.linkedList.length) {
                return false; // nothing tagged yet - can't be completed
            }
            return catalog.linkedList.every(function (key) {
                return progress.completedQuestionKeys.indexOf(key) !== -1;
            });
        }
    },

    treeNavigator: {
        label: "Tree Navigator",
        description: "Complete every tree-traversal question across the whole bomb.",
        getProgressText: function (progress, catalog) {
            const totalKeys = catalog.tree.length;
            const doneCount = catalog.tree.filter(function (key) {
                return progress.completedQuestionKeys.indexOf(key) !== -1;
            }).length;
            return doneCount + " / " + totalKeys + " questions";
        },
        check: function (progress, catalog) {
            if (!catalog.tree.length) {
                return false;
            }
            return catalog.tree.every(function (key) {
                return progress.completedQuestionKeys.indexOf(key) !== -1;
            });
        }
    },

    masterDefuser: {
        label: "Master Defuser",
        description: "Defuse an Expert-difficulty bomb without it exploding.",
        getProgressText: function (progress) {
            return progress.hasDefusedExpertBomb ? "Complete" : "Not yet";
        },
        check: function (progress) {
            return !!progress.hasDefusedExpertBomb;
        }
    }

    // Add a new achievement by adding another entry here - the
    // Achievements screen and the unlock-toast both iterate this
    // registry automatically (see renderAchievementsScreen() and
    // checkAchievements() in defusal.js), so nothing else needs to
    // change to add one. A "Hash Handler" or "Graph Grappler"
    // achievement can reuse the same categoryStats shape (hash/graph
    // are already tracked) as soon as those questions exist.
};