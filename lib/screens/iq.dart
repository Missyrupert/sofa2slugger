import 'package:flutter/material.dart';
import 'package:sofa2slugger/data/glossary_data.dart';

class IQScreen extends StatelessWidget {
  const IQScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Group items by category
    final coreItems = glossaryData.where((i) => i.category == 'Core').toList();
    final footworkItems = glossaryData.where((i) => i.category == 'Footwork').toList();
    final defenseItems = glossaryData.where((i) => i.category == 'Defense').toList();
    final conceptsItems = glossaryData.where((i) => i.category == 'Concept').toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'FIGHT IQ',
          style: TextStyle(
            fontWeight: FontWeight.w900, 
            letterSpacing: 2.0,
          ),
        ),
        centerTitle: true,
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        elevation: 0,
        surfaceTintColor: Colors.transparent, 
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _buildSectionHeader(context, "THE PILLARS"),
          ...coreItems.map((item) => _buildGlossaryItem(context, item)),
          
          const Divider(height: 48, color: Colors.white10),
          _buildSectionHeader(context, "FOOTWORK"),
          ...footworkItems.map((item) => _buildGlossaryItem(context, item)),

          const Divider(height: 48, color: Colors.white10),
          _buildSectionHeader(context, "DEFENSE"),
          ...defenseItems.map((item) => _buildGlossaryItem(context, item)),

          const Divider(height: 48, color: Colors.white10),
          _buildSectionHeader(context, "CONCEPTS"),
          ...conceptsItems.map((item) => _buildGlossaryItem(context, item)),
          
          const SizedBox(height: 48), // Bottom padding
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0, top: 8.0),
      child: Text(
        title,
        style: TextStyle(
          color: Theme.of(context).colorScheme.primary,
          fontSize: 14,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.5,
        ),
      ),
    );
  }

  Widget _buildGlossaryItem(BuildContext context, GlossaryItem item) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 48.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image Card (Only if path exists)
          // Image Card
          if (item.imagePath != null)
            Center(
              child: Container(
                height: 150, // Reduced from 220
                width: MediaQuery.of(context).size.width * 0.85, // Constrain width (85%)
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: const Color(0xFF050505),
                  borderRadius: BorderRadius.circular(8),
                  image: DecorationImage(
                    image: AssetImage(item.imagePath!),
                    fit: BoxFit.cover,
                    alignment: Alignment.topCenter,
                  ),
                  border: Border.all(color: Colors.white12, width: 1),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.8),
                      blurRadius: 12,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
              ),
            ),
          
          Text(
            item.term,
            style: theme.textTheme.headlineSmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 8),
           // "WHAT"
          _buildDetailRow(theme, "WHAT", item.definition),
           const SizedBox(height: 8),
           // "WHY & HOW"
          _buildDetailRow(theme, "WHY & HOW", item.details),
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
