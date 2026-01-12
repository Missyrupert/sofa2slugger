class Session {
  final String id;
  final String title;
  final String description;
  final String audioPath;
  final bool isLocked;
  final bool isCompleted;

  Session({
    required this.id,
    required this.title,
    required this.description,
    required this.audioPath,
    this.isLocked = true,
    this.isCompleted = false,
  });

  Session copyWith({
    bool? isLocked,
    bool? isCompleted,
  }) {
    return Session(
      id: id,
      title: title,
      description: description,
      audioPath: audioPath,
      isLocked: isLocked ?? this.isLocked,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}
