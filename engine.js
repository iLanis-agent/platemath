/* PlateMath engine - load the bar right the first time. Pure math, no DOM. */
(function (root) {
  'use strict';

  var SETS = {
    lb: { bar: 45, plates: [45, 35, 25, 10, 5, 2.5] },
    kg: { bar: 20, plates: [25, 20, 15, 10, 5, 2.5, 1.25] }
  };

  function num(v, name) {
    var n = typeof v === 'string' ? parseFloat(v) : v;
    if (typeof n !== 'number' || !isFinite(n) || isNaN(n)) throw new Error(name + ' must be a number');
    return n;
  }
  function round2(x) { return Math.round(x * 100) / 100; }

  // Greedy decomposition works for canonical plate sets (each plate <= sum of smaller ones used in pairs).
  function loadPerSide(sideWeight, plates) {
    var remaining = Math.round(sideWeight * 100) / 100;
    var used = [];
    for (var i = 0; i < plates.length; i++) {
      var p = plates[i];
      while (remaining >= p - 1e-9) {
        used.push(p);
        remaining = round2(remaining - p);
      }
    }
    return { plates: used, remainder: round2(remaining) };
  }

  function plateLoad(target, unit) {
    var set = SETS[unit];
    if (!set) throw new Error('unit must be lb or kg');
    target = num(target, 'target');
    if (target < set.bar) throw new Error('target must be at least the bar (' + set.bar + ' ' + unit + ')');
    if (target > 1500) throw new Error('target must be <= 1500');
    var side = (target - set.bar) / 2;
    var r = loadPerSide(side, set.plates);
    var achievable = r.remainder === 0;
    return {
      unit: unit,
      bar: set.bar,
      target: target,
      perSide: round2(side),
      plates: r.plates,
      achievable: achievable,
      achieved: round2(set.bar + 2 * r.plates.reduce(function (s, p) { return s + p; }, 0)),
      remainder: r.remainder
    };
  }

  // Achievable totals near a target: scan down and up in smallest-plate increments.
  function closestLoads(target, unit, span) {
    var set = SETS[unit];
    var minPlate = set.plates[set.plates.length - 1];
    var step = minPlate * 2;
    span = span || 60;
    var below = null, above = null;
    var exact = plateLoad(target, unit);
    if (exact.achievable) return { exact: exact, below: null, above: null };
    // Align to the achievable grid: bar + k*step. Stepping from the raw target
    // stays on the wrong residue class and can never land on a loadable weight.
    var aligned = set.bar + Math.floor((target - set.bar) / step) * step;
    for (var t = aligned; t >= set.bar && t >= target - span; t = round2(t - step)) {
      var r = plateLoad(t, unit);
      if (r.achievable) { below = r; break; }
    }
    for (var u = aligned + step; u <= target + span; u = round2(u + step)) {
      var r2 = plateLoad(u, unit);
      if (r2.achievable) { above = r2; break; }
    }
    return { exact: null, below: below, above: above };
  }

  function percentTable(oneRm, unit) {
    oneRm = num(oneRm, 'oneRm');
    if (oneRm <= 0 || oneRm > 1500) throw new Error('oneRm must be in (0, 1500]');
    var rows = [];
    for (var pct = 50; pct <= 100; pct += 5) {
      var raw = oneRm * pct / 100;
      var near = closestLoads(raw, unit, 12);
      var pick = near.exact || near.below || near.above;
      rows.push({ pct: pct, raw: round2(raw), weight: pick ? pick.target : null, plates: pick ? pick.plates : [] });
    }
    return rows;
  }

  var api = { SETS: SETS, plateLoad: plateLoad, closestLoads: closestLoads, percentTable: percentTable, loadPerSide: loadPerSide };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PlateMathEngine = api;
})(typeof self !== 'undefined' ? self : this);
