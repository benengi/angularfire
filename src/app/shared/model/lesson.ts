export class Lesson {
  constructor(
    public $key: string,
    public courseId: string,
    public url: string,
    public description: string,
    public duration: string,
    public tags: string,
    public videoUrl: string,
    public longDescription: string
  ) {}

  get isBeginner() {
    return this.tags && this.tags.includes('BEGINNER');
  }

  static fromJsonList(array: any[]): Lesson[] {
    return array.map(Lesson.fromJson);
  }

  static fromJson({$key, courseId, url, description, duration, tags,
    videoUrl, longDescription}): Lesson {
    return new Lesson(
      $key, courseId, url, description, duration, tags, videoUrl, longDescription);
  }
}
