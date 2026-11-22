import { Article } from '../types/article';

export const ARTICLES: Article[] = [
  {
    id: 'brinicles-finger-of-death',
    issueNumber: 'ISSUE NO. 014',
    category: 'Oceanography',
    headline: 'The Brine Stalactites That Freeze the Seafloor',
    introduction:
      'Beneath the seasonal pack ice of Antarctica, supercooled saltwater sinks in silent plumes, encasing everything it touches in a hollow sheath of ice.',
    sections: [
      {
        paragraphs: [
          'When seawater freezes at the surface of the polar oceans, the crystal lattice of pure water rejects most of the dissolved salt. What remains trapped inside microscopic channels within the ice is an extraordinarily dense, hypersaline brine. Because its high salt concentration lowers its freezing point well below zero, this liquid can cool to minus twenty degrees Celsius without solidifying.',
          'Eventually, cracks and brine channels in the sea ice allow this heavy liquid to spill into the comparatively warmer, less salty ocean water below. As the plume of supercooled brine descends, it draws heat from the surrounding seawater, causing a fragile, porous tube of ice to form around the falling stream.',
        ],
        pullQuote:
          'A brinicle grows downward like an inverted icicle, turning liquid currents into solid architecture.',
      },
      {
        subheading: 'A Slow-Motion Trap on the Seabed',
        paragraphs: [
          'First observed in the 1960s and filmed in time-lapse beneath Mount Erebus in 2011, these formations—known as brinicles—can grow several metres long in a matter of hours. Their walls are thin and sponge-like, constantly reinforced from within by the descending cold.',
          'If the water is shallow enough, the brinicle eventually reaches the seafloor. Rather than stopping, the dense brine spreads outward across the seabed like a freezing mist, forming a sheet of anchor ice. Bottom-dwelling creatures that move slowly—such as sea stars and sea urchins—can be overtaken and encased in ice within minutes.',
        ],
      },
    ],
    closingNote:
      'Once the surface ice thickens and the brine supply dwindles, the hollow stalactite dissolves back into the current, leaving no trace of its brief descent.',
    sources: [
      'Dayton, P. K., & Martin, S. (1971). Observations of ice stalactites in McMurdo Sound, Antarctica. Journal of Geophysical Research.',
      'BBC Natural History Unit / McMurdo Sound time-lapse documentation (2011).',
    ],
  },
  {
    id: 'clocks-of-the-antikythera-wreck',
    issueNumber: 'ISSUE NO. 027',
    category: 'Ancient Civilisations',
    headline: 'The Bronze Computer Recovered from a Roman Shipwreck',
    introduction:
      'For two millennia, a shoebox-sized mechanism of interlocking bronze gears rested forty-five metres beneath the Aegean Sea, centuries ahead of any known clockwork.',
    sections: [
      {
        paragraphs: [
          'In the spring of 1900, sponge divers sheltering from a storm near the Greek island of Antikythera spotted the remains of a Roman-era merchant vessel laden with marble statues and amphorae. Among the corroded bronze fragments brought to the National Archaeological Museum in Athens was an unassuming lump of calcified metal.',
          'Two years later, archaeologist Valerios Stais noticed a gear wheel embedded in the stone-like crust. It was not until the 1970s, when gamma-ray and X-ray imaging penetrated the corrosion, that researchers realised the device contained at least thirty precision-cut bronze gears.',
        ],
        pullQuote:
          'Its epicyclic gearing modelled the irregular speed of the Moon across the sky—an astronomical subtlety thought impossible in antiquity.',
      },
      {
        subheading: 'Predicting Eclipses by Hand',
        paragraphs: [
          'High-resolution X-ray tomography in 2005 revealed inscriptions written in tiny Greek characters across the surviving plates. Together, they formed an instruction manual for a portable astronomical calculator built in the second or first century BCE.',
          'By turning a hand crank on the side, an operator could advance the date and read the positions of the Sun and Moon, the phases of the Moon, the nineteen-year Metonic calendar cycle, and even the four-year cycle of the Panhellenic Games—including the Olympics.',
        ],
      },
    ],
    closingNote:
      'No comparable geared mechanism appears in the archaeological record for another thousand years, suggesting an entire tradition of Hellenistic precision engineering was lost.',
    sources: [
      'Freeth, T., et al. (2006). Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism. Nature.',
      'Price, D. J. de Solla (1974). Gears from the Greeks. Transactions of the American Philosophical Society.',
    ],
  },
  {
    id: 'voyager-golden-record-pulse',
    issueNumber: 'ISSUE NO. 039',
    category: 'Astronomy',
    headline: 'How a Pulsar Map Guides a Message Beyond the Sun',
    introduction:
      'Etched onto the gold-plated copper cover of the Voyager records is a starburst of fourteen lines—a cosmic lighthouse chart designed to outlast Earth itself.',
    sections: [
      {
        paragraphs: [
          'When Carl Sagan and Frank Drake designed the plaques for Pioneer 10 and 11, and later the cover of the Voyager Golden Record in 1977, they faced a quiet problem: how do you tell an unknown finder where a spacecraft came from when constellations drift and stars are born and die?',
          'Their answer was to use pulsars—rapidly spinning neutron stars that sweep beams of radio waves across space like lighthouse beacons. Each pulsar rotates with a distinct, measurable period that slows down at a predictable rate over millions of years.',
        ],
        pullQuote:
          'Fourteen lines radiate from a single point, each notched with binary ticks encoding the exact pulse frequency of a distant star.',
      },
      {
        subheading: 'A Triangulation Across the Galaxy',
        paragraphs: [
          'By measuring the current pulse rates of those fourteen pulsars and comparing them against the binary frequencies engraved on the cover, an astronomer millions of years in the future could calculate not only the position of our Sun in the Milky Way, but also the approximate era in which the spacecraft was launched.',
          'To establish a universal unit of time without referencing human seconds, the diagram includes a schematic of a hydrogen atom undergoing its hyperfine transition—a fundamental physical constant whose tick lasts roughly 0.7 nanoseconds everywhere in the universe.',
        ],
      },
    ],
    closingNote:
      'Voyager 1 is now more than twenty-four billion kilometres from Earth, carrying its quiet geometric map into interstellar space.',
    sources: [
      'Sagan, C., et al. (1978). Murmurs of Earth: The Voyager Interstellar Record. Random House.',
      'NASA Jet Propulsion Laboratory — Voyager Interstellar Mission.',
    ],
  },
  {
    id: 'tetrodotoxin-pufferfish-architects',
    issueNumber: 'ISSUE NO. 052',
    category: 'Natural History',
    headline: 'The Tiny Fish That Sculpt Mandalas on the Ocean Floor',
    introduction:
      'For sixteen years, divers off the coast of Japan photographed mysterious two-metre geometric circles in the sand before discovering their five-inch architect.',
    sections: [
      {
        paragraphs: [
          'Beginning in 1995, underwater photographers exploring the seabed near Amami-Oshima Island encountered intricate circular patterns etched into the white sand—radial ridges, valleys, and central plains decorated with fragments of shell.',
          'In 2011, researchers finally caught the artist at work: a newly identified species of white-spotted pufferfish, Torquigener albomaculosus, measuring barely twelve centimetres from nose to tail.',
        ],
        pullQuote:
          'Working without rest for seven to nine days, the male flaps his fins against the seabed to carve a structure twenty times his own length.',
      },
      {
        subheading: 'Hydrodynamics in the Sand',
        paragraphs: [
          'The circle is far more than an ornament. When researchers analysed water flow across the ridges, they found that the outer spokes channelled ocean currents toward the centre while slowing the water speed by nearly a quarter.',
          'This calm central basin prevents delicate eggs from being swept away by tides or buried under shifting sediment. Once a female inspects the nest and lays her eggs in the fine sand at the centre, the male stays behind to guard them—and never reuses the same circle again.',
        ],
      },
    ],
    closingNote:
      'Within days of the eggs hatching, the ocean current smooths the sand flat once more, erasing the mandala until the next season.',
    sources: [
      'Kawase, H., Okata, Y., & Ito, K. (2013). Role of huge geometric circular structures in the reproduction of a marine pufferfish. Scientific Reports.',
    ],
  },
  {
    id: 'banach-tarski-paradox',
    issueNumber: 'ISSUE NO. 068',
    category: 'Mathematics',
    headline: 'The Theorem That Splits One Sphere into Two Identical Copies',
    introduction:
      'In pure mathematics, a solid ball can be partitioned into a finite number of pieces and reassembled—without stretching or bending—into two balls of the exact same size.',
    sections: [
      {
        paragraphs: [
          'Published in 1924 by Polish mathematicians Stefan Banach and Alfred Tarski, the Banach–Tarski paradox seems to violate the most basic intuition of physical volume. How can you cut an object apart, move the pieces rigidly through space, and end up with twice as much material?',
          'The secret lies in the difference between physical matter and the mathematical continuum. A real sphere is made of atoms; a mathematical sphere is an uncountably infinite collection of dimensionless points.',
        ],
        pullQuote:
          'The pieces are not shapes you could ever cut with a knife; they are dust clouds of points so intricately tangled that they have no definable volume.',
      },
      {
        subheading: 'The Price of the Axiom of Choice',
        paragraphs: [
          'To construct these paradoxical subsets, Banach and Tarski relied on the Axiom of Choice—a foundational principle of set theory stating that given any collection of non-empty sets, one can choose a single element from each, even without an explicit rule for doing so.',
          'Because the resulting pieces are non-measurable sets, the concept of volume simply does not apply to them until they are reassembled. Remarkably, the theorem requires only five pieces, though no human could ever visualise their boundaries.',
        ],
      },
    ],
    closingNote:
      'Rather than breaking mathematics, the paradox revealed how deeply infinity diverges from everyday geometry.',
    sources: [
      'Banach, S., & Tarski, A. (1924). Sur la décomposition des ensembles de points en parties respectivement congruentes. Fundamenta Mathematicae.',
      'Wagon, S. (1993). The Banach–Tarski Paradox. Cambridge University Press.',
    ],
  },
  {
    id: 'tyrian-purple-sea-snails',
    issueNumber: 'ISSUE NO. 081',
    category: 'Material Culture',
    headline: 'Why Ancient Emperors Wore the Secretion of Sea Snails',
    introduction:
      'For over a millennium, the most coveted colour in the Mediterranean world was extracted drop by drop from predatory marine molluscs—and smelled unmistakably of the tide.',
    sections: [
      {
        paragraphs: [
          'Long before synthetic dyes, colour was bound to geography. In the Phoenician cities of Tyre and Sidon, dyers perfected a process that turned a pale, foul-smelling mucus from the hypobranchial gland of Bolinus brandaris sea snails into a deep, luminous purple that never faded in sunlight.',
          'Each snail yielded only a fraction of a millilitre of precursor fluid. Producing a single gram of pure dye required roughly ten thousand molluscs, making Tyrian purple worth more than its weight in silver.',
        ],
        pullQuote:
          'Unlike plant dyes that dulled over time, Tyrian purple grew richer and more vibrant with every exposure to the sun.',
      },
      {
        subheading: 'Chemistry in the Dye Vats',
        paragraphs: [
          'When exposed to air and light, enzymes in the snail secretion trigger a photochemical reaction that transforms colourless precursors into 6,6′-dibromoindigo. By varying the species of snail, the acidity of the vat, and the duration of sunlight, dyers could shift the hue from deep violet to dried-blood crimson.',
          'In Rome, sumptuary laws restricted full purple togas to emperors and victorious generals. Excavations near ancient dye works still uncover vast mounds of crushed shells—silent monuments to an industry built on patience.',
        ],
      },
    ],
    closingNote:
      'After the fall of Constantinople in 1453, the traditional workshops vanished, and the exact recipe remained a mystery until chemists reconstructed it in the nineteenth century.',
    sources: [
      'McGovern, P. E., & Michel, R. H. (1985). Royal Purple dye: tracing the chemical origins of the millennium. Analytical Chemistry.',
      'Pliny the Elder, Naturalis Historia, Book IX.',
    ],
  },
  {
    id: 'capgras-delusion-familiar-strangers',
    issueNumber: 'ISSUE NO. 093',
    category: 'Psychology',
    headline: 'When the Brain Recognises a Face but Feels No Warmth',
    introduction:
      'In a rare neurological condition, a person can look at someone they love, identify every feature accurately, and yet feel certain they are looking at an identical impostor.',
    sections: [
      {
        paragraphs: [
          'First described in 1923 by French psychiatrist Joseph Capgras, the Capgras delusion was long thought to be purely psychological. Patients insisted that a spouse, parent, or even a family pet had been replaced by a double.',
          'In the 1990s, neuroscientists discovered a compelling physiological explanation. Human facial recognition relies on two distinct pathways in the brain: a conscious visual route that identifies who someone is, and an emotional route connected to the amygdala that generates a quiet sense of familiarity.',
        ],
        pullQuote:
          'When the emotional wire is severed, the eyes say "I know this face," while the nervous system says "I feel nothing."',
      },
      {
        subheading: 'A Logical Conclusion to an Impossible Signal',
        paragraphs: [
          'Using skin-conductance sensors, researchers found that healthy subjects show a measurable autonomic spike when viewing photographs of loved ones. Patients with Capgras delusion showed no such response—their bodies reacted to their closest relatives as if they were complete strangers.',
          'Faced with an irreconcilable conflict between intact vision and absent emotion, the conscious mind invents the only narrative that seems to fit: the person looks identical, so they must be an impostor.',
        ],
      },
    ],
    closingNote:
      'The condition offers a rare glimpse into how quietly our emotions anchor our sense of reality.',
    sources: [
      'Ellis, H. D., & Young, A. W. (1990). Accounting for delusional misidentifications. British Journal of Psychiatry.',
      'Hirstein, W., & Ramachandran, V. S. (1997). Capgras syndrome: a novel probe for understanding the neural representation of the identity and familiarity of persons. Proceedings of the Royal Society B.',
    ],
  },
  {
    id: 'library-of-ashurbanipal-clay',
    issueNumber: 'ISSUE NO. 105',
    category: 'Forgotten History',
    headline: 'The Library That Survived Because It Was Burned',
    introduction:
      'Paper turns to ash in a fire, but when the Assyrian capital of Nineveh burned in 612 BCE, the flames baked thirty thousand clay tablets into permanent stone.',
    sections: [
      {
        paragraphs: [
          'In the seventh century BCE, King Ashurbanipal of Assyria assembled the first systematically organised library in the ancient world. Dispatching scribes across Mesopotamia, he collected astronomical omens, medical treatises, mathematical tables, lexical dictionaries, and literary epics.',
          'Unlike the papyrus scrolls of Egypt or the parchment of later centuries, Mesopotamian scribes pressed wedge-shaped cuneiform signs into damp river clay—a medium that was ordinarily fragile, prone to crumbling if dropped or dissolving if soaked.',
        ],
        pullQuote:
          'The very conflagration meant to erase Nineveh’s memory instead fired its archives like a giant kiln.',
      },
      {
        subheading: 'Rediscovering Gilgamesh in the Rubble',
        paragraphs: [
          'When a coalition of Babylonians and Medes sacked Nineveh in 612 BCE, the royal palace collapsed in an intense fire. Rather than destroying Ashurbanipal’s collection, the heat vitrified the clay tablets, preserving them beneath layers of rubble for twenty-five centuries.',
          'In the 1850s, excavators Austen Henry Layard and Hormuzd Rassam uncovered tens of thousands of fragments. Among them was the eleventh tablet of the Epic of Gilgamesh, containing a flood narrative older than any surviving biblical manuscript.',
        ],
      },
    ],
    closingNote:
      'Today, more than thirty thousand tablets and fragments from Nineveh rest in the British Museum, still being joined together like a vast ceramic puzzle.',
    sources: [
      'Finkel, I., & Taylor, J. (2015). Cuneiform. British Museum Press.',
      'British Museum — Ashurbanipal Library Project.',
    ],
  },
];
