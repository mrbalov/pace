export interface StravaActivitySignals {
  core: {
    activityType: string;
    intensity: string;
    elevation: string;
    timeOfDay: string;
    tags?: string[];
    brands?: string[];
    semanticContext?: string[];
  };
  derived: {
    mood: string;
    style: string;
    subject: string;
    terrain: string;
    environment: string;
    atmosphere: string;
  };
}
