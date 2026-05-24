-- CreateTable
CREATE TABLE "BloqueConfig" (
    "id" SERIAL NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "BloqueConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BloqueConfig" ADD CONSTRAINT "BloqueConfig_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
