// Routes driven by the smoke test, with text each page must show and the tabs to open in turn.
// Shared by e2e/record.js (records the API responses from a seeded server) and e2e/smoke.js (replays them).
module.exports = [
    { path: "/sim-set", text: ["Fixture SimSet"] },
    { path: "/sim-set/create", text: ["Create New SimSet", "Parameter Space"] },
    { path: "/sim-set/1", text: ["SimSet 1", "Optimiser steps"], tabs: ["Org configs", "Summary"] },
    { path: "/sim-set/1/org-config", text: ["SimSet 1 - OrgConfig Analysis", "4753a254"] },
    { path: "/optimiser-state/1", text: ["Optimiser State 1", "Gradient (Slope)"], tabs: ["Org configs", "OrgConfig Exploration"] },
    { path: "/optimiser-state/2", text: ["Optimiser State 2"], tabs: ["Org configs", "OrgConfig Exploration"] },
    { path: "/sim-config/1", text: ["SimConfig 1"], tabs: ["Results"] },
    { path: "/result/46", text: ["Result 46", "Operating profit"], tabs: ["SimConfig", "OrgConfig"] },
    { path: "/org-config", text: ["Summary - All org configs", "Avg Performance/ agent"] },
    { path: "/org-config/1", text: ["OrgConfig 1", "Agent set tensors"], tabs: ["SimConfigs"] },
    { path: "/monitor", text: ["Monitor", "Results / min", "Runs in flight", "Sim configs converged", "0 / 6", "http", "active"] }
];
