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
          _buildGlossaryItem(context, "STANCE", "The foundation.", "Feet shoulder-width apart, knees bent, hands up. This is your home."),
          _buildGlossaryItem(context, "GUARD", "The shield.", "Hands covering the chin, elbows tucked in to protect the body."),
          const Divider(height: 48, color: Colors.white10),
          _buildGlossaryItem(context, "JAB (1)", "The range finder.", "Lead hand straight punch. Fast, snappy, sets up everything else."),
          _buildGlossaryItem(context, "CROSS (2)", "The power.", "Rear hand straight punch. Rotates the hips and shoulders for maximum impact."),
          _buildGlossaryItem(context, "HOOK (3/4)", "The corner.", "Circular punch. Elbow high, thumb up. Targets the side of the head or body."),
          _buildGlossaryItem(context, "UPPERCUT (5/6)", "The lift.", "Vertical punch coming from underneath. Uses leg drive to lift the opponent's guard."),
        ],
      ),
    );
  }

  Widget _buildGlossaryItem(BuildContext context, String term, String definition, String details) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            term,
            style: theme.textTheme.titleLarge?.copyWith(
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
