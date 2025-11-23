// ... existing code ...
const handleEditMod = async (e) => {
  e.preventDefault();
  if (!formData.name || !formData.description || formData.tags.length === 0) {
    alert('Lengkapi nama, deskripsi, dan pilih minimal satu tag!');
    return;
  }

  const isMeme = formData.tags.includes('meme');
  const isMinecraftSeed = formData.tags.includes('minecraft') && formData.minecraftType === 'seed';

  if (isMeme) {
    // For meme, file is not needed
    if (!formData.thumbnail && !editingMod.thumbnail_url) {
      alert('Pilih gambar meme!');
      return;
    }
  } else if (isMinecraftSeed) {
    const cleanedSeeds = (formData.minecraftSeeds || []).map(s => s.trim()).filter(Boolean);
    if (cleanedSeeds.length === 0) {
      alert('Masukkan minimal satu seed!');
      return;
    }
  }

  setSubmitting(true);
  try {
    let fileUrl = editingMod.file_url;
    let thumbnailUrl = editingMod.thumbnail_url;

    if (!isMeme && !isMinecraftSeed) {
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
    // For seed, no main file; only seeds
    let finalFileUrl = fileUrl;
    let useLink = formData.useLink;

    if (isMeme) {
      finalFileUrl = thumbnailUrl;
      useLink = true;
    } else if (isMinecraftSeed) {
      finalFileUrl = '';
      useLink = true;
    }

    const cleanedSeeds = (formData.minecraftSeeds || []).map(s => s.trim()).filter(Boolean);

    await room.current.collection('file_share').update(editingMod.id, {
      name: formData.name,
      description: formData.description,
      file_url: finalFileUrl,
      thumbnail_url: thumbnailUrl,
      use_link: useLink,
      tags: formData.tags,
      minecraft_type: formData.minecraftType,
      minecraft_seeds: cleanedSeeds,
    });

    setFormData({
      name: '',
      description: '',
      file: null,
      thumbnail: null,
      useLink: false,
      fileLink: '',
      tags: [],
      minecraftType: '',
      minecraftSeeds: [''],
    });
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

