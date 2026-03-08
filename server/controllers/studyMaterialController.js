import StudyMaterial from '../models/StudyMaterial.js';

export const uploadMaterial = async (req, res) => {
    try {
        // In a real app, multer would handle file upload and req.file would exist.
        // We'll assume the client sends file metadata or base64 for now, 
        // OR simply metadata if the file is handled separately.
        // For this demo, we trust the body contains the metadata.
        const material = await StudyMaterial.create(req.body);
        res.status(201).json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMaterials = async (req, res) => {
    try {
        const materials = await StudyMaterial.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMaterial = async (req, res) => {
    try {
        const material = await StudyMaterial.findByPk(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });
        await material.destroy();
        res.json({ message: 'Material removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
