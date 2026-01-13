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
    details: "Feet shoulder-width apart, knees bent, hands up. This is your home.",
    imagePath: "assets/images/stance.png",
  ),
  GlossaryItem(
    term: "GUARD",
    category: "Core",
    definition: "The shield.",
    details: "Hands covering the chin, elbows tucked in to protect the body.",
    imagePath: "assets/images/guard.png",
  ),
  GlossaryItem(
    term: "JAB (1)",
    category: "Core",
    definition: "The range finder.",
    details: "Lead hand straight punch. Fast, snappy, sets up everything else.",
    imagePath: "assets/images/jab.png",
  ),
  GlossaryItem(
    term: "CROSS (2)",
    category: "Core",
    definition: "The power.",
    details: "Rear hand straight punch. Rotates the hips and shoulders for maximum impact.",
    imagePath: "assets/images/cross.png",
  ),
  GlossaryItem(
    term: "HOOK (3/4)",
    category: "Core",
    definition: "The corner.",
    details: "Circular punch. Elbow high, thumb up. Targets the side of the head or body.",
    imagePath: "assets/images/hook.png",
  ),
  GlossaryItem(
    term: "UPPERCUT (5/6)",
    category: "Core",
    definition: "The lift.",
    details: "Vertical punch coming from underneath. Uses leg drive to lift the opponent's guard.",
    imagePath: "assets/images/uppercut.png",
  ),

  // --- FOOTWORK ---
  GlossaryItem(
    term: "STEP DRAG",
    category: "Footwork",
    definition: "Basic movement.",
    details: "Push off the back foot to go forward. Push off the front foot to go back. Never cross your feet.",
  ),
  GlossaryItem(
    term: "PIVOT",
    category: "Footwork",
    definition: "Changing the angle.",
    details: "Spinning on the ball of the front foot to take the centerline away from your opponent.",
  ),
  GlossaryItem(
    term: "PENDULUM",
    category: "Footwork",
    definition: "The rhythm bounce.",
    details: "Moving in and out of range fluidly using a bouncing rhythm to stay elusive.",
  ),

  // --- DEFENSE ---
  GlossaryItem(
    term: "SLIP",
    category: "Defense",
    definition: "Head movement.",
    details: "Moving the head slightly off the centerline to let a straight punch sail past your ear.",
  ),
  GlossaryItem(
    term: "ROLL",
    category: "Defense",
    definition: "Going under.",
    details: "Bending the knees and rotating the waist to go under a hook like a letter 'U'.",
  ),
  GlossaryItem(
    term: "PARRY",
    category: "Defense",
    definition: "Deflecting.",
    details: "A tiny slap with the glove to redirect an opponent's punch off course.",
  ),
  GlossaryItem(
    term: "BLOCK",
    category: "Defense",
    definition: "Absorbing.",
    details: "Catching the punch on the gloves or forearms. Stable and safe.",
  ),

  // --- CONCEPTS ---
  GlossaryItem(
    term: "RANGE",
    category: "Concept",
    definition: "The distance.",
    details: "Knowing if you are in hitting range (The Pocket) or safe range (The Outside).",
  ),
  GlossaryItem(
    term: "CENTERLINE",
    category: "Concept",
    definition: "The target.",
    details: "The invisible line down the middle of your body. protect yours, attack theirs.",
  ),
  GlossaryItem(
    term: "TIMING",
    category: "Concept",
    definition: "The when.",
    details: "Speed is how fast you move. Timing is moving at the exact right moment.",
  ),
  GlossaryItem(
    term: "RHYTHM",
    category: "Concept",
    definition: "The flow.",
    details: "Breaking your rhythm confuses the opponent. Keeping a rhythm makes you predictable.",
  ),
];
