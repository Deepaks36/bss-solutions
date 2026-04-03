export async function uploadMediaFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/uploads', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload media');
  }

  const data = await response.json();
  if (!data?.path) {
    throw new Error('Upload response missing path');
  }

  return data.path as string;
}

export async function uploadImageFile(file: File): Promise<string> {
  return uploadMediaFile(file);
}
