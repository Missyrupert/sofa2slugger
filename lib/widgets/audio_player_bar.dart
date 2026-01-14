import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';
import 'package:sofa2slugger/services/audio_service.dart';

class AudioPlayerBar extends ConsumerWidget {
  const AudioPlayerBar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final audioService = ref.watch(audioServiceProvider);
    final theme = Theme.of(context);

    return StreamBuilder<PlayerState>(
      stream: audioService.playerStateStream,
      builder: (context, snapshot) {
        final playerState = snapshot.data;
        final processingState = playerState?.processingState;
        final playing = playerState?.playing;

        if (processingState == ProcessingState.idle) {
          return const SizedBox.shrink(); // Hide if nothing is loaded/playing
        }

        return Container(
          color: theme.scaffoldBackgroundColor, // Seamless blend
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (audioService.currentSessionId != 'manifesto')
                StreamBuilder<Duration>(
                  stream: audioService.positionStream,
                  builder: (context, posSnapshot) {
                    final position = posSnapshot.data ?? Duration.zero;
                    return StreamBuilder<Duration?>(
                      stream: audioService.durationStream,
                      builder: (context, durSnapshot) {
                        final duration = durSnapshot.data ?? Duration.zero;
                        final progress = (duration.inMilliseconds > 0)
                            ? position.inMilliseconds / duration.inMilliseconds
                            : 0.0;
                        
                        return LinearProgressIndicator(
                          value: progress,
                          backgroundColor: theme.colorScheme.surface,
                          valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                          minHeight: 2,
                        );
                      },
                    );
                  },
                ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "TRAINING IN PROGRESS",
                    style: theme.textTheme.labelSmall?.copyWith(color: theme.colorScheme.secondary),
                  ),
                  
                  // Controls
                  Row(
                    children: [
                       if (playing != true)
                        IconButton(
                          icon: const Icon(Icons.play_arrow),
                          iconSize: 32,
                          onPressed: audioService.play,
                        )
                      else
                        IconButton(
                          icon: const Icon(Icons.pause),
                          iconSize: 32,
                          onPressed: audioService.pause,
                        ),
                      IconButton(
                        icon: const Icon(Icons.stop), 
                        onPressed: audioService.stop,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
