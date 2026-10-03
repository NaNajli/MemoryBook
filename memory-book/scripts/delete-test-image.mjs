
import pool from "../lib/db.ts";

try {
  const result = await pool.query(
    `DELETE FROM memory_images
     WHERE id = $1
       AND file_name = $2
     RETURNING id, memory_id, file_name`,
    [1, "Picture Me.jpeg"]
  );

  if (result.rowCount === 0) {
    console.log("No se encontró la imagen. No se eliminó nada.");
  } else {
    console.log("Imagen eliminada:", result.rows[0]);
  }
} catch (error) {
  console.error("Error al eliminar la imagen:", error);
} finally {
  await pool.end();
}