export type Experiment = "FLEX" | "BASS-II" | "SAFFIRE-I";

export type AskQuestion = {
  id: string;
  experiment: Experiment;
  question: string;
  answer: string;
  evidenceQuery: string;
  note?: string;
};

export const askQuestions: AskQuestion[] = [
  // FLEX — DROPLET COMBUSTION
  {
    id: "flex-01",
    experiment: "FLEX",
    question: "What was the main objective of FLEX?",
    answer:
      "FLEX (Flame Extinguishment Experiment) investigated the combustion and extinction of fuel droplets in microgravity. Its research focused on how oxygen concentration, pressure, droplet size and suppressant gases influence flame extinction. One important objective was to determine limiting oxygen conditions under different test conditions.",
    evidenceQuery: "FLEX experiment objectives droplet flame extinction limiting oxygen pressure",
  },
  {
    id: "flex-02",
    experiment: "FLEX",
    question: "What is the Limiting Oxygen Index (LOI)?",
    answer:
      "The Limiting Oxygen Index is the lowest oxygen concentration that can support a quasi-steady flame under specified test conditions. It is useful in fire-safety research because it describes how much oxygen is needed to sustain combustion. The FLEX test plan describes determining this limit by changing oxygen concentration and observing whether a droplet continues burning or extinguishes.",
    evidenceQuery: "limiting oxygen index lowest oxygen concentration quasi steady flame FLEX",
  },
  {
    id: "flex-03",
    experiment: "FLEX",
    question: "How does oxygen concentration affect droplet extinction?",
    answer:
      "Oxygen availability is a key condition for sustaining combustion. FLEX investigated the oxygen concentration at which a droplet flame could no longer be sustained. Its test plan describes reducing oxygen in steps to identify limiting conditions. The exact extinction response also depends on the test conditions, so oxygen concentration should not be interpreted in isolation.",
    evidenceQuery: "FLEX oxygen concentration droplet flame extinction oxygen limiting conditions",
  },
  {
    id: "flex-04",
    experiment: "FLEX",
    question: "Which fuels appear in the FLEX experimental table?",
    answer:
      "The PSI-69 FLEX experimental table includes two fuel names: methanol and heptane. These are the fuel labels recorded in that dataset. This describes the contents of the available experimental table, not necessarily every fuel ever considered in the wider FLEX research programme.",
    evidenceQuery: "FLEX PSI-69 experimental table fuel methanol heptane",
  },
  {
    id: "flex-05",
    experiment: "FLEX",
    question: "Which measurements are recorded in the FLEX dataset?",
    answer:
      "The PSI-69 table records test identifiers and dates, fuel, ambient pressure, initial oxygen, nitrogen, carbon monoxide and helium mole fractions, initial droplet diameter, visible flame extinction diameter, burning rate, burn time and test-end status. Some measurement fields are missing for certain tests, so analyses should account for incomplete records.",
    evidenceQuery: "FLEX PSI-69 experimental table columns pressure oxygen nitrogen helium droplet diameter burning rate burn time",
  },
  {
    id: "flex-06",
    experiment: "FLEX",
    question: "What do the FLEX test-end labels mean?",
    answer:
      "The experimental table records three test-end labels: Disruption, Extinction and Completion. They are distinct recorded outcomes. The dataset uses these labels to describe how a test ended; they should not be treated as interchangeable or assigned more detailed physical meanings without the corresponding test documentation.",
    evidenceQuery: "FLEX experimental table test end Disruption Extinction Completion",
  },
  {
    id: "flex-07",
    experiment: "FLEX",
    question: "Why is droplet diameter important in FLEX?",
    answer:
      "Droplet diameter is an important experimental variable because FLEX investigates droplet combustion and extinction. The test plan describes selecting droplet sizes and repeating tests with different sizes when examining extinction behaviour. The available data also records initial droplet diameter and visible flame extinction diameter, although some values are missing.",
    evidenceQuery: "FLEX droplet diameter initial diameter visible flame extinction diameter test plan",
  },
  {
    id: "flex-08",
    experiment: "FLEX",
    question: "What role do inert or suppressant gases play in FLEX research?",
    answer:
      "FLEX investigated how suppressant gases and the surrounding gas mixture influence flame extinction. The test-plan material discusses gases such as carbon dioxide, helium and nitrogen in the context of flame suppression. Historical suppressant examples in that document provide background; they should not automatically be described as measured outcomes of a particular FLEX test.",
    evidenceQuery: "FLEX suppressant gases carbon dioxide helium nitrogen flame extinction",
    note: "The cited test-plan discussion includes background research; distinguish it from FLEX-specific measured results.",
  },
  {
    id: "flex-09",
    experiment: "FLEX",
    question: "What is the difference between flame extinction and burn completion?",
    answer:
      "Extinction means the flame ceases before the test is recorded as completed by burning to completion. Completion is a separate test-end label in the FLEX table. The dataset also contains Disruption, which is another distinct recorded outcome. The labels should be interpreted using the experiment documentation rather than assumed to represent identical events.",
    evidenceQuery: "FLEX test end extinction completion disruption definitions",
  },
  {
    id: "flex-10",
    experiment: "FLEX",
    question: "Why study droplet flames in microgravity?",
    answer:
      "Droplet combustion in microgravity helps researchers investigate flame behaviour under conditions where buoyancy-driven convection is greatly reduced compared with normal gravity. This makes it possible to examine the roles of processes such as heat transfer, species transport and radiation in droplet burning and extinction. FLEX research documentation discusses these processes as part of its scientific motivation.",
    evidenceQuery: "FLEX microgravity droplet combustion radiation heat transfer species transport",
  },

  // BASS-II — SOLID-FUEL FLAME SPREAD
  {
    id: "bass-01",
    experiment: "BASS-II",
    question: "What was BASS-II designed to investigate?",
    answer:
      "BASS-II investigated flame spread and solid-material combustion in the microgravity environment of the International Space Station. Its experiments involved different investigators, materials and airflow conditions. The research helps examine how material properties and the surrounding flow influence fire behaviour in spacecraft environments.",
    evidenceQuery: "BASS-II investigation objectives solid fuel flame spread microgravity",
  },
  {
    id: "bass-02",
    experiment: "BASS-II",
    question: "Which materials were investigated in BASS-II?",
    answer:
      "The BASS-II data FAQ describes several material configurations across investigator projects. These include thin PMMA films, thick PMMA slabs, PMMA rods, Nomex III, a candle and SIBAL fabric. SIBAL is described as a fabric made from 75% cotton and 25% fiberglass by weight. These are the materials documented in the available project descriptions.",
    evidenceQuery: "BASS-II materials PMMA films slabs rods Nomex candle SIBAL fabric",
  },
  {
    id: "bass-03",
    experiment: "BASS-II",
    question: "What is the purpose of the flow restrictor?",
    answer:
      "BASS-II used perforated plates as flow restrictors to control airflow through the experiment duct. According to the data FAQ, setting 0 corresponds to the highest flow and lowest restriction, while setting 2 corresponds to the lowest flow and highest restriction.",
    evidenceQuery: "BASS-II flow restrictor perforated plates setting zero setting two airflow",
  },
  {
    id: "bass-04",
    experiment: "BASS-II",
    question: "What does the fan display represent?",
    answer:
      "The BASS-II FAQ describes the fan display as the instantaneous fan voltage multiplied by ten. For example, a display value of 99 corresponds to 9.9 volts. The display is an instrument reading, not a direct measurement of airflow speed.",
    evidenceQuery: "BASS-II fan display instantaneous fan voltage multiplied by ten",
  },
  {
    id: "bass-05",
    experiment: "BASS-II",
    question: "What does the air display measure?",
    answer:
      "The air display represents airflow speed in the experiment duct, recorded in centimetres per second. The FAQ notes that the sensor has a response time of approximately one minute and that the reading reaches a steady value only after the flow has remained at a setting for some time.",
    evidenceQuery: "BASS-II air display duct flow speed cm per second response time",
  },
  {
    id: "bass-06",
    experiment: "BASS-II",
    question: "Can radiometer gain be used as absolute flame intensity?",
    answer:
      "No. The BASS-II FAQ describes radiometer gain as uncalibrated. It can help compare relative flame radiation and observe changes in flame behaviour, such as oscillations before extinction, but it should not be treated as a calibrated measurement of absolute flame intensity.",
    evidenceQuery: "BASS-II radiometer gain uncalibrated relative flame intensity oscillations",
    note: "Do not interpret radiometer gain as an absolute calibrated intensity measurement.",
  },
  {
    id: "bass-07",
    experiment: "BASS-II",
    question: "Which gases were measured in the BASS-II dataset?",
    answer:
      "The PSI-25 experimental table includes initial and final oxygen percentages, initial and final carbon dioxide percentages, and initial and final carbon monoxide readings. These measurements provide information about the gas environment before and after a test. Some carbon monoxide and carbon dioxide entries are text values rather than ordinary numbers.",
    evidenceQuery: "BASS-II PSI-25 experimental table initial final oxygen carbon dioxide carbon monoxide",
  },
  {
    id: "bass-08",
    experiment: "BASS-II",
    question: "How was oxygen concentration controlled?",
    answer:
      "The BASS-II system used nitrogen gas to vitiate the chamber atmosphere and reach desired oxygen conditions. The system requirements describe monitoring gas flow and the experiment environment. The dataset also contains calibrated initial and final oxygen percentages.",
    evidenceQuery: "BASS-II nitrogen GN2 vitiate atmosphere oxygen concentration control",
  },
  {
    id: "bass-09",
    experiment: "BASS-II",
    question: "Why are there multiple principal investigators in BASS-II?",
    answer:
      "BASS-II brought together several investigator projects that examined different materials and flame configurations. The available FAQ associates projects with different researchers and sample types, including PMMA films, slabs and rods, Nomex III, candles and SIBAL fabric. This variety allowed the programme to examine multiple solid-fuel fire scenarios rather than a single material configuration.",
    evidenceQuery: "BASS-II principal investigators projects materials Bhattacharjee Ferkul Miller Olson Fernandez-Pello Tien",
  },
  {
    id: "bass-10",
    experiment: "BASS-II",
    question: "How was flame behaviour recorded?",
    answer:
      "BASS-II used video and still images alongside instrument measurements. The system requirements describe recording flame radiation, airflow and gas conditions, while the data FAQ explains that radiometer readings can help track relative flame behaviour. The experimental records also include the number of frames captured for each test.",
    evidenceQuery: "BASS-II video still images frames radiometer airflow measurements flame behaviour",
  },

  // SAFFIRE-I — LARGE-SCALE SOLID-FUEL FIRE
  {
    id: "saffire-01",
    experiment: "SAFFIRE-I",
    question: "What was the main objective of SAFFIRE-I?",
    answer:
      "SAFFIRE-I investigated large-scale fire growth and flame spread in the low-gravity environment inside a spacecraft. The experiment was designed to examine how rapidly a large fire grows and whether a steady-state flame-spread rate is reached. These questions are relevant to understanding spacecraft fire safety.",
    evidenceQuery: "SAFFIRE-I objectives large scale fire growth steady state spread rate low gravity",
  },
  {
    id: "saffire-02",
    experiment: "SAFFIRE-I",
    question: "What is SIBAL fabric made of?",
    answer:
      "The SAFFIRE experiment documentation describes SIBAL as a fabric containing 75% cotton and 25% fiberglass by weight. The cotton provides combustible material, while the fiberglass helps the sample maintain structural integrity after the cotton has been consumed.",
    evidenceQuery: "SAFFIRE SIBAL fabric 75 percent cotton 25 percent fiberglass",
  },
  {
    id: "saffire-03",
    experiment: "SAFFIRE-I",
    question: "What airflow speed was used in SAFFIRE-I?",
    answer:
      "The SAFFIRE-I documentation and experimental table specify an airflow speed of 20 centimetres per second for the sample tests. This is an experiment condition, not a general airflow value for all SAFFIRE missions.",
    evidenceQuery: "SAFFIRE-I airflow velocity 20 cm/s sample experiment",
  },
  {
    id: "saffire-04",
    experiment: "SAFFIRE-I",
    question: "How many sample records are in the available SAFFIRE-I table?",
    answer:
      "The available PSI-98 SAFFIRE-I experimental table contains two sample records, S1 and S2. Both list SIBAL fabric. The other rows in the table describe camera and pre-test flow-visualization information, so they should not be counted as additional material-burn samples.",
    evidenceQuery: "PSI-98 SAFFIRE-I experimental table sample number S1 S2 flow visualization",
  },
  {
    id: "saffire-05",
    experiment: "SAFFIRE-I",
    question: "What burn times are recorded for the two SAFFIRE-I samples?",
    answer:
      "The PSI-98 table records a burn time of 420 seconds for sample S1 and 70 seconds for sample S2. S1 is listed with concurrent flow and S2 with opposed flow. These are observations from two sample records and are not enough, by themselves, to establish a general rule about the effect of flow direction.",
    evidenceQuery: "SAFFIRE-I PSI-98 sample S1 420 seconds S2 70 seconds concurrent opposed",
    note: "Only two sample records are available in this table; avoid broad statistical conclusions.",
  },
  {
    id: "saffire-06",
    experiment: "SAFFIRE-I",
    question: "What is the difference between concurrent and opposed flow?",
    answer:
      "Concurrent flow means the airflow travels in the same general direction as the flame-spread direction. Opposed flow means the airflow travels against the flame-spread direction. The SAFFIRE-I table labels S1 as concurrent and S2 as opposed. These labels describe the flow configuration; they do not, on their own, establish which configuration produces faster spread.",
    evidenceQuery: "SAFFIRE-I concurrent opposed flow direction sample S1 S2",
  },
  {
    id: "saffire-07",
    experiment: "SAFFIRE-I",
    question: "What were the ignition conditions in the available sample records?",
    answer:
      "The PSI-98 table lists an ignition power of 182 watts and an ignition time of 8 seconds for the two SIBAL sample records. These values describe the recorded test conditions. They should not be confused with the subsequent burn time.",
    evidenceQuery: "SAFFIRE-I PSI-98 ignition power 182 W ignition time 8 seconds",
  },
  {
    id: "saffire-08",
    experiment: "SAFFIRE-I",
    question: "Why were two cameras used?",
    answer:
      "The SAFFIRE-I documentation organizes image data by sample and camera, identifying camera views as C1 and C2. The available documentation confirms that two cameras captured experiment imagery. It does not justify assigning a specific purpose or viewing angle to each camera without further camera documentation.",
    evidenceQuery: "SAFFIRE-I camera C1 C2 image directory sample camera data",
  },
  {
    id: "saffire-09",
    experiment: "SAFFIRE-I",
    question: "Why was SAFFIRE operated aboard the Cygnus spacecraft?",
    answer:
      "SAFFIRE-I operations were conducted after Cygnus departed the International Space Station. The operations document describes activating the experiment after the spacecraft had unberthed and entered a lower orbit. This allowed the experiment to be performed in the spacecraft environment without conducting an open flame experiment inside the occupied ISS.",
    evidenceQuery: "SAFFIRE-I operations Cygnus unberths ISS lower orbit experiment start",
  },
  {
    id: "saffire-10",
    experiment: "SAFFIRE-I",
    question: "How was experiment data returned to Earth?",
    answer:
      "The SAFFIRE-I operations plan describes recording and compressing experiment data, downlinking it, checking data quality and retransmitting data when necessary. The document identifies a data limit of 20 gigabits. After the experiment and data operations, Cygnus was scheduled for destructive atmospheric re-entry.",
    evidenceQuery: "SAFFIRE-I operations downlink data quality retransmit 20 gigabits",
  },
];