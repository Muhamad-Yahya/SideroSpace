import type { ExperimentResearchContent } from "@/components/ExperimentResearchContext";

export const flexResearchContent: ExperimentResearchContent = {
  id: "flex",
  identifier: "PSI-69",
  scope: "274 FLEX table records",
  title: "FLEX · Flame Extinguishment Experiment",
  overview:
    "FLEX investigates liquid-fuel droplet burning and extinction in microgravity, including how oxygen concentration, ambient pressure, and inert-gas suppressants relate to flame stability and sustained combustion. The project includes the PSI-69 experimental table, not the complete FLEX research record.",
  objectives: [
    "Investigate the burning and extinction behavior of liquid-fuel droplets.",
    "Study oxygen concentration and the limiting oxygen index for steady combustion.",
    "Examine the effectiveness of inert-gas suppressants, including carbon dioxide and helium.",
    "Investigate ambient-pressure effects and improve combustion models with microgravity measurements.",
  ],
  setup: [
    "Conducted aboard the International Space Station using the Combustion Integrated Rack and Multi-user Droplet Combustion Apparatus.",
    "Liquid-fuel droplets were ignited in controlled gaseous environments.",
    "The supplied research describes tests with fuels including heptane and methanol.",
    "Researchers observed whether droplets burned to completion or extinguished before all fuel was consumed.",
    "Microgravity permits study of spherical droplet flames with less distortion from buoyancy-driven flow.",
  ],
  variables: [
    { name: "FLEX Test # / FLEX Identifier", meaning: "Source record and experiment identifiers.", unit: "Identifiers; not measurements." },
    { name: "Test Date / Test GMT", meaning: "Recorded date and time metadata.", unit: "Date/time fields as recorded." },
    { name: "Fuel", meaning: "Liquid fuel label for the record.", unit: "Categorical." },
    { name: "Ambient pressure; mmHg", meaning: "Recorded ambient experimental pressure.", unit: "mmHg (source field)." },
    { name: "O initial ambient composition; mole fraction", meaning: "Initial oxygen composition.", unit: "Mole fraction; preserve source scale." },
    { name: "N initial ambient composition; mole fraction", meaning: "Recorded initial N composition.", unit: "Mole fraction; source field label retained." },
    { name: "CO initial ambient composition; mole fraction", meaning: "Recorded initial carbon monoxide composition.", unit: "Mole fraction." },
    { name: "He initial ambient composition; mole fraction", meaning: "Recorded initial helium composition.", unit: "Mole fraction." },
    { name: "Droplet initial diameter; mm", meaning: "Droplet diameter before combustion.", unit: "mm (source field)." },
    { name: "Visible flame extinction diameter; mm", meaning: "Recorded droplet diameter at visible flame extinction.", unit: "mm (source field)." },
    { name: "Burning rate; mm", meaning: "Recorded burning-rate field; its physical definition is not established by the CSV header alone.", unit: "The source header says mm; do not reinterpret as mm²/s without source documentation." },
    { name: "Burn time; s", meaning: "Recorded burning duration.", unit: "s (source field); special tokens remain source values." },
    { name: "Test end", meaning: "Recorded test-end label.", unit: "Categorical source value." },
  ],
  availableEvidence: [
    "The 274 records can be filtered to inspect recorded fuel, pressure, composition, droplet-size, burn-time, and test-end values.",
    "Users can examine recorded burning-rate values and associations with other fields, while retaining the source field definition and unit caveat.",
    "Records labeled complete burning or extinction can be examined when represented by the source Test end field.",
    "Missing and nonnumeric values remain distinct from zero and are not imputed.",
  ],
  limitations: [
    "Each record represents a particular experimental configuration, not every spacecraft atmosphere.",
    "Differences between fuel groups do not establish that fuel alone caused differences in recorded values.",
    "A visible extinction diameter is not automatically a universal extinction threshold.",
    "The CSV alone does not document a confirmed physical definition or unit for the Burning rate; mm field.",
    "Controlled droplet experiments cannot independently establish the safety of a spacecraft, material, or habitat.",
  ],
  sources: [
    { type: "NASA investigation record", label: "FLEX · PSI-69", href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69" },
    { type: "NASA experiment overview", label: "Flame Configuration / FLEX", href: "https://gipoc.grc.nasa.gov/wp/fcf-cir/flex/" },
    { type: "NASA technical document", label: "Combustion in Reduced Gravity", href: "https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf" },
    { type: "Local dataset · 274 records", label: "PSI-69 FLEX table (CSV)", href: "/data/flex/flex.csv" },
  ],
};

export const bassResearchContent: ExperimentResearchContent = {
  id: "bass",
  identifier: "PSI-25",
  scope: "129 BASS-II table records",
  title: "BASS-II · Burning and Suppression of Solids",
  overview:
    "BASS-II studies ignition, burning, flame spread, and extinction of solid materials in microgravity under low-velocity forced airflow. The dataset currently integrated here contains gas-composition and experiment metadata; those fields are not direct flame-spread measurements.",
  objectives: [
    "Investigate ignition of solid fuels, flame growth and spread, and extinction limits.",
    "Study how airflow influences solid-fuel combustion.",
    "Compare microgravity behavior with normal-gravity material flammability screening.",
    "Provide experimental information for combustion models and fire detection and suppression system design.",
  ],
  setup: [
    "Conducted aboard the International Space Station with solid fuel samples under low-velocity forced airflow.",
    "The supplied BASS-II research description includes material geometries such as slabs, cylinders, and spherical sections.",
    "Environmental conditions include oxygen concentration and airflow.",
    "The integrated CSV contains test, fuel-material, system-display, frame-count, and gas-measurement fields.",
  ],
  variables: [
    { name: "Test # / Date / GMT / Sample # / PI", meaning: "Identifiers and recorded experiment metadata.", unit: "As recorded; no measurement units implied." },
    { name: "Fuel Sample Material", meaning: "Original material description for the sample.", unit: "Categorical source label." },
    { name: "Flow restrictor / Fan display / Air display", meaning: "Recorded system or airflow display fields.", unit: "Exact physical interpretation and units are not established by these labels alone." },
    { name: "Radiometer gain   (1000   250   50   10)", meaning: "Recorded radiometer-gain field.", unit: "Original header retained; detailed definition not established by the CSV alone." },
    { name: "Total Frames Shot", meaning: "Recorded frame count.", unit: "Count." },
    { name: "Calibrated  initial O2 % by vol ", meaning: "Calibrated initial oxygen concentration.", unit: "% by volume (source field)." },
    { name: "Calibrated final O2 % by vol", meaning: "Calibrated final oxygen concentration.", unit: "% by volume (source field)." },
    { name: "Initial CO2 % by vol / Final CO2 % by vol", meaning: "Recorded initial and final carbon dioxide measurements.", unit: "% by volume (source fields)." },
    { name: "Initial CO (ppm) / Final CO (ppm)", meaning: "Recorded initial and final carbon monoxide measurements.", unit: "ppm (source fields)." },
  ],
  availableEvidence: [
    "The 129 source records can be searched and filtered by original fuel-material labels.",
    "Initial and final oxygen, carbon dioxide, and carbon monoxide values can be inspected where numeric values are recorded.",
    "Missing measurement coverage and changes between paired gas readings can be explored descriptively.",
    "The source table preserves test and system metadata for further inspection or export.",
  ],
  limitations: [
    "The CSV contains gas-composition measurements, not enough information by themselves to calculate flame-spread rate, ignition time, or extinction limits.",
    "A change between initial and final gas readings does not identify a combustion mechanism or prove causation.",
    "Missing values must not be interpreted as zero; gas-field units and calibration/timing details must follow source documentation.",
    "Different fuels and configurations can behave differently; Earth-based screening is not an exact substitute for microgravity testing.",
  ],
  sources: [
    { type: "NASA investigation record", label: "BASS-II · PSI-25", href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-25" },
    { type: "Technical research description", label: "BASS-II research objectives and variables · National Academies", href: "https://sites.nationalacademies.org/cs/groups/ssbsite/documents/webpage/ssb_152359.pdf" },
    { type: "Local dataset · 129 records", label: "BASS-II experimental table (CSV)", href: "/data/bass-ii/bass-ii.csv" },
  ],
};

export const saffireResearchContent: ExperimentResearchContent = {
  id: "saffire",
  identifier: "PSI-98",
  scope: "764 F1C1 pre-test images",
  title: "SAFFIRE-I · Spacecraft Fire Safety Experiment",
  overview:
    "SAFFIRE-I investigated large-scale flame growth and spread over a solid material in low gravity, addressing fire sizes larger than earlier space-based experiments. It was designed to inform spacecraft fire-safety research, not to certify a material or vehicle as safe.",
  note: {
    title: "Important: the local sequence is pre-test flow visualization",
    body: "The 764 local F1C1 JPEG frames are pre-test flow-visualization imagery, not footage of the sample-burning experiment. They must not be interpreted as observed flame growth or combustion measurements.",
  },
  objectives: [
    "Investigate large-scale flame growth in microgravity and flame spread over a solid material.",
    "Examine material flammability limits and gather information relevant to spacecraft fire-safety research.",
    "Help reduce uncertainty in spacecraft fire-safety system design.",
  ],
  setup: [
    "Conducted in an uncrewed Cygnus cargo vehicle after it departed the International Space Station; the mission was completed in July 2016.",
    "The documented experiment enclosure was approximately 0.5 m wide, 1 m deep, and 1.3 m long, with a flow duct and avionics bay.",
    "The burn sample was a cotton-fiberglass blend measuring approximately 0.4 m by 1 m.",
    "Ignition used a hot wire under ground-controller command.",
  ],
  variables: [
    { name: "F1C1 frame number", meaning: "Frame index in the local pre-test flow-visualization sequence.", unit: "Sequence index; not a flame measurement." },
    { name: "Filename", meaning: "Original local JPEG filename.", unit: "Source identifier." },
    { name: "timestampMs / timestampUtc", meaning: "Timestamp metadata recorded in the local manifest.", unit: "Milliseconds since epoch / UTC string." },
    { name: "Image dimensions", meaning: "Local JPEG image dimensions verified by the project.", unit: "1280 × 920 pixels." },
  ],
  availableEvidence: [
    "The project can display, navigate, and download the available F1C1 pre-test images and inspect their frame and timestamp metadata.",
    "NASA technical references describe the documented spacecraft, enclosure, sample, and experiment context.",
    "The local image sequence gives access to the supplied visualization data, but it does not provide numerical flame-spread or heat-release measurements.",
  ],
  limitations: [
    "A single experimental configuration does not represent every spacecraft material or atmosphere.",
    "Sample and flow conditions matter when interpreting flame spread.",
    "Images alone cannot establish numerical flame-spread rates or heat-release rates without corresponding measurements and methods.",
    "Pre-test flow-visualization images are not evidence of actual fire behavior.",
    "Results must not be presented as proof that a spacecraft material is safe or unsafe.",
  ],
  sources: [
    { type: "NASA investigation record", label: "SAFFIRE-I · PSI-98", href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98" },
    { type: "NASA technical document", label: "Spacecraft Fire Safety Demonstration", href: "https://www.nasa.gov/wp-content/uploads/2025/07/spacecraft-fire-safety-demonstration-saffire.pdf" },
    { type: "NASA mission announcement", label: "NASA Glenn Successfully Ignites Largest Fire Experiment in Space", href: "https://www.nasa.gov/news-release/nasa-glenn-successfully-ignites-largest-fire-experiment-in-space/" },
    { type: "Local technical document", label: "SAFFIRE-I Operations", href: "/data/research/SAFFIRE-I%20Operations.pdf" },
    { type: "Local image data guide", label: "SAFFIRE-I Image Directory Nomenclature", href: "/data/research/SAFFIRE-I%20Image%20Directory%20Nomenclature.pdf" },
    { type: "Local image dataset · 764 frames", label: "F1C1 pre-test flow-visualization manifest", href: "/data/saffire/f1c1/manifest.json" },
  ],
};
