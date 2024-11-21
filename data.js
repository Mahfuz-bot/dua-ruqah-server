export async function getCategoriesWithDetails(db, cat_id = null) {
  // Prepare the SQL query with dynamic filtering based on cat_id
  const query = `
    SELECT 
      c.cat_id, c.cat_name_bn, c.cat_name_en, c.no_of_subcat, c.no_of_dua, c.cat_icon,
      sc.subcat_id, sc.subcat_name_bn, sc.subcat_name_en, sc.no_of_dua AS subcat_no_of_dua,
      d.dua_id, d.dua_name_bn, d.dua_name_en, d.top_bn, d.top_en, 
      d.dua_arabic, d.dua_indopak, d.clean_arabic,
      d.transliteration_bn, d.transliteration_en, d.translation_bn, d.translation_en,
      d.bottom_bn, d.bottom_en, d.refference_bn, d.refference_en, d.audio
    FROM category c
    LEFT JOIN sub_category sc ON sc.cat_id = c.cat_id
    LEFT JOIN dua d ON (d.cat_id = c.cat_id AND (d.subcat_id = sc.subcat_id OR d.subcat_id IS NULL))
    ${cat_id ? "WHERE c.cat_id = ?" : ""}
    ORDER BY c.cat_id, sc.subcat_id, d.dua_id;
  `

  
  const rows = cat_id ? db.prepare(query).all(cat_id) : db.prepare(query).all()

  
  const categoriesMap = {}

  rows.forEach((row) => {
    if (!categoriesMap[row.cat_id]) {
      categoriesMap[row.cat_id] = {
        id: row.cat_id,
        cat_id: row.cat_id,
        cat_name_bn: row.cat_name_bn,
        cat_name_en: row.cat_name_en,
        no_of_subcat: row.no_of_subcat,
        no_of_dua: row.no_of_dua,
        cat_icon: row.cat_icon,
        subcategories: [],
        duas: [], 
      }
    }

    const category = categoriesMap[row.cat_id]

    if (row.subcat_id) {
      let subcategory = category.subcategories.find(
        (subcat) => subcat.subcat_id === row.subcat_id
      )

      if (!subcategory) {
        subcategory = {
          id: row.subcat_id,
          cat_id: row.cat_id,
          subcat_id: row.subcat_id,
          subcat_name_bn: row.subcat_name_bn,
          subcat_name_en: row.subcat_name_en,
          no_of_dua: row.subcat_no_of_dua,
          duas: [],
        }
        category.subcategories.push(subcategory)
      }

      if (
        row.dua_id &&
        !subcategory.duas.find((dua) => dua.dua_id === row.dua_id)
      ) {
        subcategory.duas.push({
          id: row.id,
          cat_id: row.cat_id,
          subcat_id: row.subcat_id,
          dua_id: row.dua_id,
          dua_name_bn: row.dua_name_bn,
          dua_name_en: row.dua_name_en,
          top_bn: row.top_bn,
          top_en: row.top_en,
          dua_arabic: row.dua_arabic,
          dua_indopak: row.dua_indopak,
          clean_arabic: row.clean_arabic,
          transliteration_bn: row.transliteration_bn,
          transliteration_en: row.transliteration_en,
          translation_bn: row.translation_bn,
          translation_en: row.translation_en,
          bottom_bn: row.bottom_bn,
          bottom_en: row.bottom_en,
          refference_bn: row.refference_bn,
          refference_en: row.refference_en,
          audio: row.audio,
        })
      }
    } else if (row.dua_id) {
      if (!category.duas.find((dua) => dua.dua_id === row.dua_id)) {
        category.duas.push({
          id: row.id,
          cat_id: row.cat_id,
          subcat_id: null,
          dua_id: row.dua_id,
          dua_name_bn: row.dua_name_bn,
          dua_name_en: row.dua_name_en,
          top_bn: row.top_bn,
          top_en: row.top_en,
          dua_arabic: row.dua_arabic,
          dua_indopak: row.dua_indopak,
          clean_arabic: row.clean_arabic,
          transliteration_bn: row.transliteration_bn,
          transliteration_en: row.transliteration_en,
          translation_bn: row.translation_bn,
          translation_en: row.translation_en,
          bottom_bn: row.bottom_bn,
          bottom_en: row.bottom_en,
          refference_bn: row.refference_bn,
          refference_en: row.refference_en,
          audio: row.audio,
        })
      }
    }
  })

  return Object.values(categoriesMap).map((category) => ({
    ...category,
    subcategories: category.subcategories.map((subcat) => ({
      ...subcat,
      duas: subcat.duas || [],
    })),
    duas: category.duas || [],
  }))
}
