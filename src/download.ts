import { addPath } from '@actions/core'
import { exec } from '@actions/exec'
import { downloadTool } from '@actions/tool-cache'
import { mkdirP, mv } from '@actions/io'
import path from 'path'

/**
 * Downloader helper function
 * - downloads file from URL;
 * - extracts if tar archive recognized from url;
 * - makes executable
 * - add to path
 * @param url link to download
 * @param destination full path
 */
export default async function (url: string, destination: string): Promise<string> {
  const downloadPath = await downloadTool(url)
  const destinationDir = path.dirname(destination)
  await mkdirP(destinationDir)
  if (url.endsWith('tar.gz') || url.endsWith('tar') || url.endsWith('tgz')) {
    await exec('tar', ['-xz', `--file=${downloadPath}`, `--directory=${destinationDir}`, `--strip=1`])
  }
  await mv(downloadPath, destination)
  await exec('chmod', ['+x', destination])
  addPath(destinationDir)
  return downloadPath
}
