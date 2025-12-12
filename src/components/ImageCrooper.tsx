"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";

interface ImageCropperProps {
  imageSrc: string;
  onSave: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onSave, onCancel }: ImageCropperProps) {
  // posição do corte (x, y)
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // nível de zoom do cropper
  const [zoom, setZoom] = useState<number>(1);
  // área selecionada em pixels (usada para recortar no canvas)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    
    if (!croppedAreaPixels) {
      console.warn('Nenhuma área selecionada para cortar');
      return;
    }

    try {
      const image = new Image();
      image.src = imageSrc;
      await image.decode();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error('Não foi possível obter contexto do canvas');
        return;
      }

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Converter para JPEG com compressão (qualidade 0.7 = ~70% para reduzir tamanho)
      const base64Image = canvas.toDataURL("image/jpeg", 0.7);
      onSave(base64Image);
    } catch (error) {
      console.error('Erro ao cortar imagem:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-52 xs:h-60 sm:h-64 bg-black rounded-md overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        {/* Salva a imagem recortada e chama onSave(base64) */}
        <Button className="cursor-pointer" onClick={getCroppedImg}>Salvar</Button>
      </div>
    </div>
  );
}
