import { BaseDirectory, mkdir, exists } from '@tauri-apps/plugin-fs'
import { homeDir, join } from '@tauri-apps/api/path'

export async function ensureProjectsDir(): Promise<string> {
  const home = await homeDir()
  const projectsPath = await join(home, 'VibePlan')
  const dirExists = await exists(projectsPath)
  if (!dirExists) {
    await mkdir(projectsPath, { recursive: true })
  }
  return projectsPath
}

export async function getDefaultSavePath(projectName: string): Promise<string> {
  const dir = await ensureProjectsDir()
  return await join(dir, `${projectName}.vibeplan.json`)
}
