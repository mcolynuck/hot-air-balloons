# Hot-Air Balloons

A demonstration of CSS animation using imagery.  It provides a sense of depth using multiple image sizes moving at relative speeds based on their size.

## Features
Initially, there are 3 balloons started at page load time.  A random time interval triggrs the addition of further balloons to a maximum of 12 (for processing issues).

Balloon size is determined at random and the speed is based on that size.

Clicking on a balloon causes it to start a new set of animations resulting in the balloon dropping at a speed greater than rising speed.

Clicking in the open sky will halt the process of adding new balloons.  Clicking in the sky again will start new balloons to be added again.

## Notes
The animation transitions use a percentage for their vertical displacement.  As there are many sizes of balloons, this percentage has to be large enough not only to allow the bottoms of large balloons to rise above the upper view area, but also for balloons many times smaller.  The result of this is that small balloons continue to rise well beyond the views vertical limit which has the effect of consuming additiona time before a new balloon is initiated.

So that balloons overlap the sides of the view to give realism, the calucated width of the view is greater than the actual view.  For this reason, a smaaller balloon may consume resources while rising out-of-sight.

If the browser is hidden behind other applications or other tabs viewed, the animations pause such that once the page is brought into view again there is a mass rising of balloons all at once rather than continuously loaded at random.

Once balloon animations are completed, they are removed from the DOM to avoid growing memory consumption.