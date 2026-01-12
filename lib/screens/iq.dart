import 'package:flutter/material.dart';

class IQScreen extends StatefulWidget {
  const IQScreen({super.key});

  @override
  _IQScreenState createState() => _IQScreenState();
}

class _IQScreenState extends State<IQScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'IQ',
          style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5),
        ),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _buildGlossaryItem(context, "STANCE", "The foundation.", "Feet shoulder-width apart, knees bent, hands up. This is your home.", "assets/images/stance.png"),
          _buildGlossaryItem(context, "GUARD", "The shield.", "Hands covering the chin, elbows tucked in to protect the body.", "assets/images/guard.png"),
          const Divider(height: 48, color: Colors.white10),
          _buildGlossaryItem(context, "JAB (1)", "The range finder.", "Lead hand straight punch. Fast, snappy, sets up everything else.", "assets/images/jab.png"),
          _buildGlossaryItem(context, "CROSS (2)", "The power.", "Rear hand straight punch. Rotates the hips and shoulders for maximum impact.", "assets/images/cross.png"),
          _buildGlossaryItem(context, "HOOK (3/4)", "The corner.", "Circular punch. Elbow high, thumb up. Targets the side of the head or body.", "assets/images/hook.png"),
          _buildGlossaryItem(context, "UPPERCUT (5/6)", "The lift.", "Vertical punch coming from underneath. Uses leg drive to lift the opponent's guard.", "assets/images/uppercut.png"),
        ],
      ),
    );
  }

  Widget _buildGlossaryItem(BuildContext context, String term, String definition, String details, String imagePath) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 48.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image Card
          Container(
            height: 200,
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: const Color(0xFF111111),
              borderRadius: BorderRadius.circular(12),
              image: DecorationImage(
                image: AssetImage(imagePath),
                fit: BoxFit.cover,
              ),
              border: Border.all(color: Colors.white10),
            ),
          ),
          
          Text(
            term,
            style: theme.textTheme.headlineSmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 8),
           // "WHAT"
          _buildDetailRow(theme, "WHAT", definition),
           const SizedBox(height: 8),
           // "WHY" / "HOW" could be merged or split. Using "WHY & HOW" logic from description.
          _buildDetailRow(theme, "WHY & HOW", details),
        ],
      ),
    );
  }

  Widget _buildDetailRow(ThemeData theme, String label, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80, 
          child: Text(
            label,
            style: theme.textTheme.labelSmall?.copyWith(
              color: theme.colorScheme.primary, 
              fontWeight: FontWeight.bold
            )
          ),
        ),
        Expanded(
          child: Text(
            text,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.white70,
              height: 1.4,
            ),
          ),
        ),
      ],
    );
  }
}
