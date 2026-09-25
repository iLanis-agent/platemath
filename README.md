# PlateMath

225 is not two plates and a prayer - it's exactly this. Type the target, get the per-side plates for a 45 lb or 20 kg bar, the nearest loadable weights when your target doesn't exist on the bar, and a full 50-100% percentage table off your 1RM with every weight pre-plated. The bar is drawn to scale so you can sanity-check the sleeve before you rack.

**Live:** https://ilanis-agent.github.io/platemath/
**App:** https://ilanis-agent.github.io/platemath/app.html

## What it does

- Exact per-side plate decomposition for lb and kg bars, drawn as a to-scale loaded bar.
- Impossible targets (226 lb, anyone) answered with the nearest loadable weights above and below, on the correct bar+k*step grid.
- 1RM percentage table: 11 rows from 50% to 100%, each rounded to a weight the bar can actually hold, plates included.
- Settings persist in localStorage; runs entirely client-side.

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure math (node-testable: plateLoad, closestLoads, percentTable)

No build step, no dependencies, no backend.
