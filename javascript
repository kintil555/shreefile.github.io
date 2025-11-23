// ... existing code ...
const handleEditMod = async (e) => {
  e.preventDefault();
  if (!formData.name || !formData.description || formData.tags.length === 0) {
    alert('Lengkapi nama, deskripsi, dan pilih minimal satu tag!');
    return;
  }

  if (formData.tags.includes('meme')) {
    // For meme, file is not needed
    if (!formData.thumbnail && !editingMod.thumbnail_url) {
      alert('Pilih gambar meme!');
      return;
    }
  }

  setSubmitting(true);
  try {
    let fileUrl = editingMod.file_url;
    let thumbnailUrl = editingMod.thumbnail_url;

    if (!formData.tags.includes('meme')) {
      if (formData.useLink && formData.fileLink) {
        fileUrl = formData.fileLink;
      } else if (!formData.useLink && formData.file) {
        fileUrl = await uploadFileWithProgress(formData.file, 'File');
      }
    }

    if (formData.thumbnail) {
      thumbnailUrl = await uploadFileWithProgress(formData.thumbnail, 'Thumbnail');
    }

    // For meme, use thumbnail as the main file and set use_link to true
    const finalFileUrl = formData.tags.includes('meme') ? thumbnailUrl : fileUrl;
    const useLink = formData.tags.includes('meme') ? true : formData.useLink;

    await room.current.collection('file_share').update(editingMod.id, {
      name: formData.name,
      description: formData.description,
      file_url: finalFileUrl,
      thumbnail_url: thumbnailUrl,
      use_link: useLink,
      tags: formData.tags,
    });

    setFormData({ name: '', description: '', file: null, thumbnail: null, useLink: false, fileLink: '', tags: [] });
    setFileNames({ file: '', thumbnail: '' });
    setThumbnailPreview(null);
    setUploadProgress({ percentage: 0, file: '' });
    setShowEditModal(false);
    setEditingMod(null);
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal mengedit file!');
    setUploadProgress({ percentage: 0, file: '' });
  } finally {
    setSubmitting(false);
  }
};
// ... existing code ...

