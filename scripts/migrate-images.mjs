import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  'https://iqfsnkmtpffrepcedwih.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

mkdirSync('./public/products', { recursive: true })

const { data: files } = await supabase.storage
  .from('product-images')
  .list('', { limit: 1000 })

console.log(`Stahuji ${files.length} souborů...`)

for (const file of files) {
  const { data } = await supabase.storage
    .from('product-images')
    .download(file.name)

  const buffer = Buffer.from(await data.arrayBuffer())
  writeFileSync(join('./public/products', file.name), buffer)
  console.log(`✓ ${file.name}`)
}

console.log('Hotovo!')
