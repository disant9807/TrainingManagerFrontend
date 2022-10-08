export class TReview {
    id: string;

    Rating: string;

    Created: string;

    Update: string | null;

    Archive: string;

    IsArchive: boolean | null;

    Description: string;

    ReplyToId: string | null;

    UserId: string;

    TrainingProgramId: string;

    Images: string[];

    constructor () {
      this.id = ''
      this.Rating = ''
      this.Created = ''
      this.Update = null
      this.Archive = ''
      this.IsArchive = null
      this.Description = ''
      this.ReplyToId = null
      this.UserId = ''
      this.TrainingProgramId = ''
      this.Images = []
    }
}
