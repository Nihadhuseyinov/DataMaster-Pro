export type View = 'dashboard' | 'upload' | 'sql' | 'python' | 'workspace' | 'salary' | 'automl' | 'reports' | 'gmail' | 'settings';

export interface AppState {
  currentView: View;
  darkMode: boolean;
  selectedDataset: string | null;
}
