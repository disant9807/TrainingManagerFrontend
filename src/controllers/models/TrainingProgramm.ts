import { TReview } from './Review'
import { TQuestion } from './Question'

export class TTrainingProgramm {
    id: string;

    Created: string;

    DatePublish: string;

    Description: string;

    Name: string;

    ForWhom: string;

    HowLong: string;

    WhatResults: string;

    Archive: string;

    IsArchive: boolean | null;

    UserId: string;

    CategoryCode: string;

    IsMain: boolean | null;

    MainSort: number | null;

    Sex: number;

    Age: number;

    Complexity: number;

    Reviews: TReview[] | null;

    Questions: TQuestion[] | null;

    MainImage: string | null;

    constructor () {
      this.id = ''
      this.Created = ''
      this.DatePublish = ''
      this.Description = ''
      this.Name = ''
      this.ForWhom = ''
      this.HowLong = ''
      this.WhatResults = ''
      this.Archive = ''
      this.IsArchive = false
      this.UserId = ''
      this.CategoryCode = ''
      this.IsMain = null
      this.MainSort = null
      this.Sex = 0
      this.Age = 0
      this.Complexity = 0
      this.Reviews = []
      this.Questions = []
      this.MainImage = null
    }
}
