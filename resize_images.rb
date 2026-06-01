#!/usr/bin/env ruby
# Resize images for web usage using ImageMagick 7

require 'fileutils'

INPUT_DIR = 'images'
OUTPUT_DIR = 'processed'
MAX_WIDTH = 1400
QUALITY = 82

# Create output directory
FileUtils.mkdir_p(OUTPUT_DIR)

# Supported image extensions
extensions = %w[.jpg .jpeg .png .gif .webp]

# Get all image files
images = Dir.glob("#{INPUT_DIR}/*").select do |f|
  extensions.include?(File.extname(f).downcase)
end

puts "Found #{images.length} images to process"

images.each_with_index do |input_path, index|
  filename = File.basename(input_path)
  output_path = File.join(OUTPUT_DIR, filename.downcase.gsub(/\.jpeg$/, '.jpg'))
  
  # Use magick (IMv7) to resize, optimize quality, and strip metadata
  cmd = [
    'magick',
    input_path,
    '-resize', "#{MAX_WIDTH}x#{MAX_WIDTH}>",
    '-quality', QUALITY.to_s,
    '-strip',
    output_path
  ]
  
  print "[#{index + 1}/#{images.length}] Processing #{filename}... "
  
  if system(*cmd)
    puts "done"
  else
    puts "FAILED"
  end
end

puts "\nProcessing complete! Images saved to #{OUTPUT_DIR}/"
