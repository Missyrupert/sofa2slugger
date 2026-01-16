import 'dart:html' as html;
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:just_audio/just_audio.dart'; // Audio for preview
import 'package:sofa2slugger/services/storage.dart';

class LandingScreen extends StatefulWidget {
  const LandingScreen({super.key});

  @override
  State<LandingScreen> createState() => _LandingScreenState();
}

class _LandingScreenState extends State<LandingScreen> {
  bool _isLoading = false;
  late AudioPlayer _previewPlayer;
  bool _isPlayingPreview = false;
  bool _isPreviewLoading = false;

  @override
  void initState() {
    super.initState();
    _previewPlayer = AudioPlayer();
    _previewPlayer.playerStateStream.listen((state) {
      if (mounted) {
        setState(() {
          _isPlayingPreview = state.playing;
          _isPreviewLoading = state.processingState == ProcessingState.loading || 
                              state.processingState == ProcessingState.buffering;
          
          if (state.processingState == ProcessingState.completed) {
            _isPlayingPreview = false;
            _previewPlayer.seek(Duration.zero);
            _previewPlayer.pause();
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _previewPlayer.dispose();
    super.dispose();
  }

  Future<void> _togglePreview() async {
    if (_isPlayingPreview) {
      await _previewPlayer.pause();
    } else {
      if (_previewPlayer.duration == null) {
         try {
           // Load Session 1 as a preview sample
           await _previewPlayer.setAudioSource(
             AudioSource.uri(Uri.parse('audio/session01.mp3')),
           );
         } catch (e) {
           print("Error loading preview: $e");
           return;
         }
      }
      await _previewPlayer.play();
    }
  }

  Future<void> _handleBuy() async {
    // Smart Entry: If user has already paid, go straight to gym
    if (StorageService.isPremium) {
      context.go('/gym');
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await html.HttpRequest.request(
        '/.netlify/functions/create-checkout',
        method: 'POST',
        requestHeaders: {'Content-Type': 'application/json'},
      );

      if (response.status == 200) {
        final data = json.decode(response.responseText ?? '{}');
        final url = data['url'];
        if (url != null) {
          html.window.location.href = url;
        }
      } else {
        throw Exception('Failed to create checkout');
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Unable to start checkout. Please try again.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0B0B0B),
      body: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 860),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 48),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   // ---------------------------------------------------------
                   // 1. HERO SECTION (Concrete & Direct)
                   // ---------------------------------------------------------
                  Text(
                    'SOFA2SLUGGER',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2.0,
                      fontFamily: GoogleFonts.bebasNeue().fontFamily,
                    ),
                  ),
                  const SizedBox(height: 16),

                  Text(
                    'LEARN REAL BOXING\nFUNDAMENTALS AT HOME.',
                    style: GoogleFonts.bebasNeue(
                      fontSize: 64, // Big Impact
                      height: 0.9,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'Ten audio-guided sessions. No gym, no gear, no jargon.',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w400,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Value Props / Bullets
                  _buildBullet('10 sessions, each 10–15 minutes'),
                  _buildBullet('No gloves, no bag, you just need space to move'),
                  _buildBullet('Created by a boxing coach for starts-from-zero beginners'),

                  const SizedBox(height: 32),

                   // ---------------------------------------------------------
                   // 2. AUDIO PREVIEW (Trust)
                   // ---------------------------------------------------------
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1A1A1A),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Row(
                      children: [
                        GestureDetector(
                          onTap: _togglePreview,
                          child: Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary,
                              shape: BoxShape.circle,
                            ),
                            child: _isPreviewLoading 
                              ? const Padding(
                                  padding: EdgeInsets.all(12.0),
                                  child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2),
                                )
                              : Icon(
                                  _isPlayingPreview ? Icons.pause : Icons.play_arrow,
                                  color: Colors.black,
                                  size: 28,
                                ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'HEAR A PREVIEW',
                                style: TextStyle(
                                  color: Colors.grey[500],
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.0,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Sample from Session 01: Foundations',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // ---------------------------------------------------------
                  // 3. ACTION SECTION (Frictionless Flow)
                  // ---------------------------------------------------------
                  SizedBox(
                    width: double.infinity,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Primary: Start Free
                        ElevatedButton(
                          onPressed: () => context.go('/splash'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: theme.colorScheme.primary, // Elite Gold
                            foregroundColor: Colors.black,
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4), // Square/Brutalist
                            ),
                            elevation: 0,
                          ),
                          child: Text(
                            'START SESSION 1 (FREE)',
                            style: GoogleFonts.bebasNeue(
                              fontSize: 24,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Secondary: Buy
                        OutlinedButton(
                          onPressed: _isLoading ? null : _handleBuy,
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Colors.grey[800]!),
                            foregroundColor: Colors.grey[400],
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                          child: Text(
                            _isLoading ? 'LOADING...' : 'UNLOCK FULL CAMP (£9.99)',
                             style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Center(
                     child: Text(
                      'No subscription. One-time payment.',
                      style: TextStyle(color: Colors.grey[600], fontSize: 12),
                    ),
                  ),

                  const SizedBox(height: 64),

                  // ---------------------------------------------------------
                  // 4. SYLLABUS (Structure & Progression)
                  // ---------------------------------------------------------
                  Text(
                    'THE PROGRESSION',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2.0,
                      fontFamily: GoogleFonts.bebasNeue().fontFamily,
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Free Modules
                  _buildSyllabusItem('01', 'FOUNDATIONS', 'Stance, balance, and the basic guard.', isFree: true),
                  _buildSyllabusItem('02', 'MOVEMENT', 'Stepping without crossing your feet.', isFree: true),
                  
                  // Paid Modules
                  _buildSyllabusLine(),
                  _buildSyllabusItem('03', 'LEAD SIDE', 'The Jab. The most important punch.', isFree: false),
                  _buildSyllabusItem('04', 'REAR SIDE', 'The Cross. Power and rotation.', isFree: false),
                  _buildSyllabusItem('05', 'RHYTHM', 'Linking movement and striking.', isFree: false),
                  _buildSyllabusItem('06', 'CONSISTENCY', 'Building the engine.', isFree: false),
                  _buildSyllabusItem('07', 'TARGETS', 'Precision over power.', isFree: false),
                  _buildSyllabusItem('08', 'DISTANCE', 'Range management.', isFree: false),
                  _buildSyllabusItem('09', 'DEFENCE', 'Protecting yourself.', isFree: false),
                  _buildSyllabusItem('10', 'THE ROUND', 'Putting it all together.', isFree: false),

                  const SizedBox(height: 48),

                  // ---------------------------------------------------------
                  // 5. SECONDARY CTA (Mid-page reminder)
                  // ---------------------------------------------------------
                  _buildCard(
                    'READY TO COMMIT?',
                    'You can start for free right now. The first two sessions are on the house.\n\nWhen you\'re ready to finish the camp, it\'s just £9.99.',
                  ),
                   SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _handleBuy,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white10,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      child: Text(
                        _isLoading ? 'REDIRECTING...' : 'UNLOCK FULL CAMP',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),

                  const SizedBox(height: 64),

                  // Footer
                  Center(
                    child: Text(
                      'Sofa2Slugger — Built for the ones who stopped believing they could move.',
                      style: TextStyle(color: Colors.grey[800], fontSize: 12),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBullet(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.check, color: Theme.of(context).colorScheme.primary, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(color: Color(0xFFE0E0E0), fontSize: 16, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSyllabusLine() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Row(
        children: [
          Expanded(child: Divider(color: Colors.white10)),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Icon(Icons.lock_outline, color: Colors.white24, size: 16),
          ),
          Expanded(child: Divider(color: Colors.white10)),
        ],
      ),
    );
  }

  Widget _buildSyllabusItem(String number, String title, String desc, {required bool isFree}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              border: Border.all(color: isFree ? Theme.of(context).colorScheme.primary : Colors.white24),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              number,
              style: TextStyle(
                color: isFree ? Theme.of(context).colorScheme.primary : Colors.white24,
                fontWeight: FontWeight.bold,
                fontFamily: GoogleFonts.sourceCodePro().fontFamily,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: isFree ? Colors.white : Colors.white60,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    if (isFree)
                      Padding(
                        padding: const EdgeInsets.only(left: 8.0),
                        child: Text(
                          'FREE',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
                Text(
                  desc,
                  style: TextStyle(color: Colors.grey[600], fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCard(String title, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFF242424)),
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withOpacity(0.02),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(color: Colors.grey[300], height: 1.5),
          ),
        ],
      ),
    );
  }
}
