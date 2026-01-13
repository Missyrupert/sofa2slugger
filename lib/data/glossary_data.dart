class GlossaryItem {
  final String term;
  final String category; // 'Core', 'Defense', 'Footwork', 'Concept'
  final String definition; // 'WHAT'
  final String details; // 'WHY & HOW'
  final String? imagePath;

  const GlossaryItem({
    required this.term,
    required this.category,
    required this.definition,
    required this.details,
    this.imagePath,
  });
}

const List<GlossaryItem> glossaryData = [
  // --- CORE (The 6 Pillars) ---
  GlossaryItem(
    term: "STANCE",
    category: "Core",
    definition: "The foundation.",
    details: "Feet shoulder-width apart, knees bent, hands up. This is your home. Everything starts and ends here.",
    imagePath: "assets/images/stance.png",
  ),
  GlossaryItem(
    term: "GUARD",
    category: "Core",
    definition: "The shield.",
    details: "Hands covering the chin, elbows tucked in to protect the ribs. Eyes forward, chin down.",
    imagePath: "assets/images/guard.png",
  ),
  GlossaryItem(
    term: "JAB",
    category: "Core",
    definition: "The range finder.",
    details: "Lead hand straight punch. Fast, snappy. It sets up attacks and disrupts the opponent.",
    imagePath: "assets/images/jab.png",
  ),
  GlossaryItem(
    term: "CROSS",
    category: "Core",
    definition: "The hammer.",
    details: "Rear hand straight punch. Rotate hips and shoulders. High power, long range.",
    imagePath: "assets/images/cross.png",
  ),
  GlossaryItem(
    term: "HOOK",
    category: "Core",
    definition: "The corner.",
    details: "Circular punch. Elbow high, thumb up. Targets the side of the head or body. devastating power.",
    imagePath: "assets/images/hook.png",
  ),
  GlossaryItem(
    term: "UPPERCUT",
    category: "Core",
    definition: "The lift.",
    details: "Vertical punch from underneath. Uses leg drive to lift the opponent's head or dig to the solar plexus.",
    imagePath: "assets/images/uppercut.png",
  ),

  // --- FOOTWORK ---
  GlossaryItem(
    term: "STEP DRAG",
    category: "Footwork",
    definition: "The inchworm.",
    details: "Push off the back foot to go forward. Push off the front foot to go back. Maintain stance width.",
  ),
  GlossaryItem(
    term: "PIVOT",
    category: "Footwork",
    definition: "The angle.",
    details: "Spinning on the ball of the front foot to take the centerline away from your opponent and create a new attack angle.",
  ),
  GlossaryItem(
    term: "PENDULUM",
    category: "Footwork",
    definition: "The bounce.",
    details: "Moving in and out of range fluidly using a bouncing rhythm. Keeps you elusive and ready to spring.",
  ),
  GlossaryItem(
    term: "L-STEP",
    category: "Footwork",
    definition: "The exit.",
    details: "Pulling back and stepping laterally (90 degrees) to escape a corner or reset the engagement.",
  ),
  GlossaryItem(
    term: "SHUFFLE",
    category: "Footwork",
    definition: "The micro-step.",
    details: "Small, rapid adjustments of the feet to maintain balance and range without committing to a full step.",
  ),

  // --- DEFENSE ---
  GlossaryItem(
    term: "SLIP",
    category: "Defense",
    definition: "The ghost.",
    details: "Moving the head slightly off center to let a straight punch sail past your ear. Loads the counter-punch.",
  ),
  GlossaryItem(
    term: "ROLL",
    category: "Defense",
    definition: "The U-turn.",
    details: "Bending knees and rotating waist to go under a hook. Like drawing a letter 'U' with your head.",
  ),
  GlossaryItem(
    term: "PARRY",
    category: "Defense",
    definition: "The deflection.",
    details: "A tiny slap with the glove to redirect an opponent's punch off course. Requires sharp timing.",
  ),
  GlossaryItem(
    term: "BLOCK",
    category: "Defense",
    definition: "The wall.",
    details: "Catching the punch on the gloves or forearms. Safest defense but you take some impact.",
  ),
  GlossaryItem(
    term: "CATCH",
    category: "Defense",
    definition: "The trap.",
    details: "Stopping a punch (usually a jab) in the palm of your glove. Like catching a baseball.",
  ),
  GlossaryItem(
    term: "CLINCH",
    category: "Defense",
    definition: "The hug.",
    details: "Tying up the opponent's arms close range to stop their offense or catch a breath.",
  ),

  // --- CONCEPTS ---
  GlossaryItem(
    term: "RANGE",
    category: "Concept",
    definition: "The distance.",
    details: "Long range (Straight punches), Mid range (Hooks/Uppercuts), Close range (Clinch/Body). Know where you are.",
  ),
  GlossaryItem(
    term: "CENTERLINE",
    category: "Concept",
    definition: "The target.",
    details: "The invisible line down the middle of your body. Protect yours, attack theirs.",
  ),
  GlossaryItem(
    term: "TIMING",
    category: "Concept",
    definition: "The when.",
    details: "Speed is physical. Timing is intellectual. Striking when the opponent is vulnerable.",
  ),
  GlossaryItem(
    term: "RHYTHM",
    category: "Concept",
    definition: "The flow.",
    details: "Patterns of movement. Breaking your rhythm confuses the opponent. Keeping a rhythm makes you predictable.",
  ),
  GlossaryItem(
    term: "FEINT",
    category: "Concept",
    definition: "The lie.",
    details: "A deceptive movement to trigger a reaction from the opponent without committing to an attack.",
  ),
  GlossaryItem(
    term: "COUNTER",
    category: "Concept",
    definition: "The answer.",
    details: "Striking the opponent while they are attacking. Uses their own momentum against them.",
  ),
  GlossaryItem(
    term: "COMBINATION",
    category: "Concept",
    definition: "The flow.",
    details: "Linking punches together in a sequence. Flowing from one strike to the next seamlessly.",
  ),
];
