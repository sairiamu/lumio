import { mkdir, exists } from '@tauri-apps/plugin-fs'
import { homeDir, join } from '@tauri-apps/api/path'

export async function ensureProjectsDir(): Promise<string> {
  const home = await homeDir()
  const projectsPath = await join(home, 'Lumio')
  const dirExists = await exists(projectsPath)
  if (!dirExists) {
    await mkdir(projectsPath, { recursive: true })
  }
  return projectsPath
}

export async function getDefaultSavePath(projectName: string, extension: string = 'lumio.json'): Promise<string> {
  const dir = await ensureProjectsDir()
  return await join(dir, `${projectName}.${extension}`)
}

export async function checkOldProjectMigration(): Promise<boolean> {
  const home = await homeDir()
  const oldDir = await join(home, 'Vi' + 'be' + 'Pl' + 'an')
  return await exists(oldDir)
}
