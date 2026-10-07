// ===================================================================
// Achievement definitions
//
// Loaded as a plain <script> tag, same convention as the question
// bank files - this file just needs to run before defusal.js and it
// hands off ACHIEVEMENT_REGISTRY as a global.
//
// Each achievement is checked against a `progress` snapshot loaded by
// defusal.js (see loadAchievementProgress()). progress has this shape:
//
//   {
//     categoryStats: { stack: { correct, total }, queue: {...}, ... },
//     completedQuestionKeys: ["module3:ll-insert-01", ...],
//     unlockedAchievementIds: [...],
//
//     // bomb-level stats (updated when a bomb ends)
//     defusedDifficulties:   ["easy", "hard", ...],
//     flawlessDifficulties:  [...]   defused with 0 strikes
//     fastDifficulties:      [...]   defused with >= ACH_FAST_FRACTION of the clock left
//     explodedDifficulties:  [...]   exploded at least once
//     bombsDefused: 0, bombsExploded: 0,
//     hadPhotoFinish: false,         defused with <= ACH_PHOTO_FINISH_SECONDS left
//     hasDefusedAfterExploding: false,
//
//     // module-level / streak stats
//     perfectModules: ["identify", "module3", ...],
//     bestStreak: 0
//   }
//
// Every achievement entry has:
//   group            heading it is listed under on the Achievements screen
//   label            display name
//   description      one-line goal
//   getProgressText  (progress, catalog) -> string shown while locked
//   check            (progress, catalog) -> true once it should unlock
//   isAvailable      OPTIONAL (progress, catalog) -> false hides the
//                    achievement and skips its check. Used so that
//                    category achievements don't show up (and can't
//                    be impossible) until that category actually has
//                    tagged questions.
//
// `catalog` is category -> every "moduleId:questionId" key that exists
// across the question banks (see buildQuestionCatalog() in defusal.js).
//
// Achievements are only ever evaluated outside practice mode.
//
// Registry key order = display order within each group. The four
// original keys (stackSpecialist, pointerTechnician, treeNavigator,
// masterDefuser) are unchanged so players keep what they unlocked.
// ===================================================================

// ---- tuning knobs ----
const ACH_SPECIALIST_MIN_QUESTIONS = 10;
const ACH_SPECIALIST_MIN_ACCURACY = 0.9;
const ACH_COMPLETIONIST_MIN_POOL = 5;     // hide "complete every X" until X has this many questions
const ACH_WELL_ROUNDED_MIN_QUESTIONS = 5;
const ACH_FAST_FRACTION = 0.5;            // "Speed Demon": this much of the clock left
const ACH_PHOTO_FINISH_SECONDS = 10;
const ACH_STREAK_SMALL = 10;
const ACH_STREAK_BIG = 25;
const ACH_BOMBS_SEASONED = 5;
const ACH_BOMBS_LEGEND = 25;

const ACH_CATEGORY_NOUN = {
    stack: "stack",
    queue: "queue",
    linkedList: "linked-list",
    tree: "tree",
    hash: "hash table",
    graph: "graph",
    sorting: "sorting",
    array: "array"
};

const ACH_ALL_DIFFICULTIES = ["easy", "intermediate", "hard", "expert"];

function achHas(list, value) {
    return list.indexOf(value) !== -1;
}

function achHasAny(list, values) {
    return values.some(function (value) {
        return achHas(list, value);
    });
}

// ---- factories ----

// "Defuse a bomb on <difficulty>"
function makeDefuseAchievement(difficultyId, label, description) {
    return {
        group: "Bomb Disposal",
        label: label,
        description: description,
        getProgressText: function (progress) {
            return achHas(progress.defusedDifficulties, difficultyId) ? "Complete" : "Not yet";
        },
        check: function (progress) {
            return achHas(progress.defusedDifficulties, difficultyId);
        }
    };
}

// "Complete N <category> questions with >= 90% accuracy" (lifetime stats)
function makeCategorySpecialist(category, label) {
    const noun = ACH_CATEGORY_NOUN[category];

    return {
        group: "Specialists",
        label: label,
        description: "Complete " + ACH_SPECIALIST_MIN_QUESTIONS + " " + noun +
            " questions with \u2265 " + Math.round(ACH_SPECIALIST_MIN_ACCURACY * 100) + "% accuracy.",
        isAvailable: function (progress, catalog) {
            return catalog[category].length > 0;
        },
        getProgressText: function (progress) {
            const stats = progress.categoryStats[category];
            const total = stats ? stats.total : 0;

            if (total < ACH_SPECIALIST_MIN_QUESTIONS) {
                return total + " / " + ACH_SPECIALIST_MIN_QUESTIONS + " attempted";
            }

            // Enough attempts, so the only thing holding it back is accuracy -
            // show that instead of a "10 / 10" that looks finished but isn't.
            const percent = Math.round((stats.correct / total) * 100);
            return total + " attempted \u00B7 " + percent + "% accuracy (need " +
                Math.round(ACH_SPECIALIST_MIN_ACCURACY * 100) + "%)";
        },
        check: function (progress) {
            const stats = progress.categoryStats[category];
            if (!stats || stats.total < ACH_SPECIALIST_MIN_QUESTIONS) {
                return false;
            }
            return (stats.correct / stats.total) >= ACH_SPECIALIST_MIN_ACCURACY;
        }
    };
}

// "Complete every <category> question across the whole bomb"
function makeCategoryCompletionist(category, label, noun) {
    function countDone(progress, catalog) {
        return catalog[category].filter(function (key) {
            return achHas(progress.completedQuestionKeys, key);
        }).length;
    }

    return {
        group: "Completionist",
        label: label,
        description: "Complete every " + noun + " question across the whole bomb.",
        isAvailable: function (progress, catalog) {
            return catalog[category].length >= ACH_COMPLETIONIST_MIN_POOL;
        },
        getProgressText: function (progress, catalog) {
            return countDone(progress, catalog) + " / " + catalog[category].length + " questions";
        },
        check: function (progress, catalog) {
            return catalog[category].length > 0 &&
                countDone(progress, catalog) === catalog[category].length;
        }
    };
}

// ---- the registry ----
const ACHIEVEMENT_REGISTRY = {

    // ===== Bomb Disposal: the difficulty ladder + volume =====
    rookieDefuser: makeDefuseAchievement(
        "easy", "Rookie Defuser", "Defuse an Easy-difficulty bomb."),

    fieldAgent: makeDefuseAchievement(
        "intermediate", "Field Agent", "Defuse an Intermediate-difficulty bomb."),

    squadVeteran: makeDefuseAchievement(
        "hard", "Bomb Squad Veteran", "Defuse a Hard-difficulty bomb."),

    masterDefuser: makeDefuseAchievement(
        "expert", "Master Defuser", "Defuse an Expert-difficulty bomb without it exploding."),

    fullSpectrum: {
        group: "Bomb Disposal",
        label: "Full Spectrum",
        description: "Defuse a bomb on every difficulty.",
        getProgressText: function (progress) {
            return progress.defusedDifficulties.length + " / " + ACH_ALL_DIFFICULTIES.length + " difficulties";
        },
        check: function (progress) {
            return ACH_ALL_DIFFICULTIES.every(function (id) {
                return achHas(progress.defusedDifficulties, id);
            });
        }
    },

    seasonedAgent: {
        group: "Bomb Disposal",
        label: "Seasoned Agent",
        description: "Defuse " + ACH_BOMBS_SEASONED + " bombs in total.",
        getProgressText: function (progress) {
            return Math.min(progress.bombsDefused, ACH_BOMBS_SEASONED) + " / " + ACH_BOMBS_SEASONED + " bombs";
        },
        check: function (progress) {
            return progress.bombsDefused >= ACH_BOMBS_SEASONED;
        }
    },

    squadLegend: {
        group: "Bomb Disposal",
        label: "Bomb Squad Legend",
        description: "Defuse " + ACH_BOMBS_LEGEND + " bombs in total.",
        getProgressText: function (progress) {
            return Math.min(progress.bombsDefused, ACH_BOMBS_LEGEND) + " / " + ACH_BOMBS_LEGEND + " bombs";
        },
        check: function (progress) {
            return progress.bombsDefused >= ACH_BOMBS_LEGEND;
        }
    },

    // ===== Clutch Plays: style points, not just survival =====
    cleanCut: {
        group: "Clutch Plays",
        label: "Clean Cut",
        description: "Defuse a bomb without a single strike.",
        getProgressText: function (progress) {
            return progress.flawlessDifficulties.length ? "Complete" : "Not yet";
        },
        check: function (progress) {
            return progress.flawlessDifficulties.length > 0;
        }
    },

    surgeonsHands: {
        group: "Clutch Plays",
        label: "Surgeon's Hands",
        description: "Defuse a Hard or Expert bomb without a single strike.",
        getProgressText: function (progress) {
            return achHasAny(progress.flawlessDifficulties, ["hard", "expert"]) ? "Complete" : "Not yet";
        },
        check: function (progress) {
            return achHasAny(progress.flawlessDifficulties, ["hard", "expert"]);
        }
    },

    speedDemon: {
        group: "Clutch Plays",
        label: "Speed Demon",
        description: "Defuse an Intermediate or harder bomb with at least " +
            Math.round(ACH_FAST_FRACTION * 100) + "% of the clock left.",
        getProgressText: function (progress) {
            return achHasAny(progress.fastDifficulties, ["intermediate", "hard", "expert"]) ? "Complete" : "Not yet";
        },
        check: function (progress) {
            return achHasAny(progress.fastDifficulties, ["intermediate", "hard", "expert"]);
        }
    },

    photoFinish: {
        group: "Clutch Plays",
        label: "Photo Finish",
        description: "Defuse a bomb with " + ACH_PHOTO_FINISH_SECONDS + " seconds or less left on the clock.",
        getProgressText: function (progress) {
            return progress.hadPhotoFinish ? "Complete" : "Not yet";
        },
        check: function (progress) {
            return !!progress.hadPhotoFinish;
        }
    },

    backFromTheBlast: {
        group: "Clutch Plays",
        label: "Back From the Blast",
        description: "Defuse a bomb on a difficulty where you've exploded before.",
        getProgressText: function (progress) {
            return progress.hasDefusedAfterExploding ? "Complete" : "Not yet";
        },
        check: function (progress) {
            return !!progress.hasDefusedAfterExploding;
        }
    },

    onARoll: {
        group: "Clutch Plays",
        label: "On a Roll",
        description: "Answer " + ACH_STREAK_SMALL + " questions in a row correctly in one bomb.",
        getProgressText: function (progress) {
            return Math.min(progress.bestStreak, ACH_STREAK_SMALL) + " / " + ACH_STREAK_SMALL + " best streak";
        },
        check: function (progress) {
            return progress.bestStreak >= ACH_STREAK_SMALL;
        }
    },

    unstoppable: {
        group: "Clutch Plays",
        label: "Unstoppable",
        description: "Answer " + ACH_STREAK_BIG + " questions in a row correctly in one bomb.",
        getProgressText: function (progress) {
            return Math.min(progress.bestStreak, ACH_STREAK_BIG) + " / " + ACH_STREAK_BIG + " best streak";
        },
        check: function (progress) {
            return progress.bestStreak >= ACH_STREAK_BIG;
        }
    },

    // ===== Module Mastery =====
    flawlessModule: {
        group: "Module Mastery",
        label: "Flawless Module",
        description: "Finish any module with every question answered correctly.",
        getProgressText: function (progress) {
            return progress.perfectModules.length ? "Complete" : "Not yet";
        },
        check: function (progress) {
            return progress.perfectModules.length > 0;
        }
    },

    perfectPanel: {
        group: "Module Mastery",
        label: "Perfect Panel",
        description: "Finish every module flawlessly at least once (they don't have to be in the same run).",
        // MODULE_REGISTRY lives in defusal.js; these functions only run
        // after it exists, so reading it here is safe.
        getProgressText: function (progress) {
            return progress.perfectModules.length + " / " + Object.keys(MODULE_REGISTRY).length + " modules";
        },
        check: function (progress) {
            return Object.keys(MODULE_REGISTRY).every(function (moduleId) {
                return achHas(progress.perfectModules, moduleId);
            });
        }
    }
};

// ===== Specialists: one per category (Stack Specialist keeps its original key) =====
[
    ["stack", "stackSpecialist", "Stack Specialist"],
    ["queue", "queueSpecialist", "FIFO Fanatic"],
    ["linkedList", "linkedListSpecialist", "Link Master"],
    ["tree", "treeSpecialist", "Root Access"],
    ["hash", "hashSpecialist", "Hash Handler"],
    ["graph", "graphSpecialist", "Graph Grappler"],
    ["sorting", "sortingSpecialist", "Sorting Savant"],
    ["array", "arraySpecialist", "Array Architect"]
].forEach(function (entry) {
    ACHIEVEMENT_REGISTRY[entry[1]] = makeCategorySpecialist(entry[0], entry[2]);
});

// ===== Completionists: every question in a category (Pointer Technician / Tree Navigator keep their keys) =====
[
    ["stack", "stackCompletionist", "LIFO Legend", "stack"],
    ["queue", "queueCompletionist", "Front of the Line", "queue"],
    ["linkedList", "pointerTechnician", "Pointer Technician", "linked-list"],
    ["tree", "treeNavigator", "Tree Navigator", "tree-traversal"],
    ["hash", "hashCompletionist", "Collision Resolver", "hash table"],
    ["graph", "graphCompletionist", "Cartographer", "graph"],
    ["sorting", "sortingCompletionist", "Order Restored", "sorting"],
    ["array", "arrayCompletionist", "Index Inspector", "array"]
].forEach(function (entry) {
    ACHIEVEMENT_REGISTRY[entry[1]] = makeCategoryCompletionist(entry[0], entry[2], entry[3]);
});

// ===== Grand Challenge (added last so it's evaluated after everything else) =====
ACHIEVEMENT_REGISTRY.wellRounded = {
    group: "Grand Challenge",
    label: "Well Rounded",
    description: "Answer at least " + ACH_WELL_ROUNDED_MIN_QUESTIONS + " questions in every topic.",
    getProgressText: function (progress, catalog) {
        const topics = Object.keys(catalog).filter(function (category) {
            return catalog[category].length > 0;
        });
        const covered = topics.filter(function (category) {
            const stats = progress.categoryStats[category];
            return stats && stats.total >= ACH_WELL_ROUNDED_MIN_QUESTIONS;
        });
        return covered.length + " / " + topics.length + " topics";
    },
    check: function (progress, catalog) {
        const topics = Object.keys(catalog).filter(function (category) {
            return catalog[category].length > 0;
        });
        if (!topics.length) {
            return false;
        }
        return topics.every(function (category) {
            const stats = progress.categoryStats[category];
            return stats && stats.total >= ACH_WELL_ROUNDED_MIN_QUESTIONS;
        });
    }
};

// Unlock every other (currently available) achievement. Must stay the
// LAST entry: checkAchievements() walks the registry in order, so by
// the time this runs, anything unlocked earlier in the same pass is
// already counted.
ACHIEVEMENT_REGISTRY.dataStructureSage = (function () {
    function otherIds(progress, catalog) {
        return Object.keys(ACHIEVEMENT_REGISTRY).filter(function (id) {
            if (id === "dataStructureSage") {
                return false;
            }
            const achievement = ACHIEVEMENT_REGISTRY[id];
            return !achievement.isAvailable || achievement.isAvailable(progress, catalog);
        });
    }

    return {
        group: "Grand Challenge",
        label: "Data Structure Sage",
        description: "Unlock every other achievement.",
        getProgressText: function (progress, catalog) {
            const ids = otherIds(progress, catalog);
            const done = ids.filter(function (id) {
                return achHas(progress.unlockedAchievementIds, id);
            }).length;
            return done + " / " + ids.length + " achievements";
        },
        check: function (progress, catalog) {
            return otherIds(progress, catalog).every(function (id) {
                return achHas(progress.unlockedAchievementIds, id);
            });
        }
    };
})();