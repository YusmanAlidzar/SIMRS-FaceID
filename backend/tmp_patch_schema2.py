from pathlib import Path
import re
path = Path('..\\database\\schema.sql')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r"\('poly-orthopedi', 'Poli Orthopedi', 'ORT', 'dr\. Hendra Pratama, Sp\.OT', 'Bone', 'Perawatan cedera tulang, sendi, otot, dan ligamen rangka\.'\);", re.MULTILINE)
new = "('poly-orthopedi', 'Poli Orthopedi', 'ORT', 'dr. Hendra Pratama, Sp.OT', 'Bone', 'Perawatan cedera tulang, sendi, otot, dan ligamen rangka.'),\n('poly-saraf', 'Poli Saraf', 'SRF', 'dr. Rian Hidayat, Sp.N', 'Brain', 'Diagnosis dan penanganan gangguan otak, saraf, dan sumsum.'),\n('poly-gigi', 'Poli Gigi', 'GIG', 'drg. Fitria Lestari', 'Smile', 'Pelayanan kebersihan mulut, gigi berlubang, dan ortodonsi.'),\n('poly-mata', 'Poli Mata', 'MAT', 'dr. Yusuf Hamdan, Sp.M', 'Eye', 'Spesialisasi gangguan penglihatan, katarak, dan kacamata.'),\n('poly-tht', 'Poli THT', 'THT', 'dr. Dina Mariana, Sp.THT-KL', 'Ear', 'Pemeriksaan hidung, tenggorokan, dan fungsi pendengaran.'),\n('poly-kulit', 'Poli Kulit & Kelamin', 'KK', 'dr. Susan Anggraini, Sp.DV', 'Sparkles', 'Layanan terapi kecantikan kulit, alergi, dan infeksi luar.'),\n('poly-psikiatri', 'Poli Psikiatri', 'PSI', 'dr. Ridwan Chaniago, Sp.KJ', 'HeartHandshake', 'Konsultasi kesehatan jiwa, konseling stress, dan depresi.');"
if not pattern.search(text):
    raise SystemExit('pattern not found')
text = pattern.sub(new, text, count=1)
path.write_text(text, encoding='utf-8')
print('schema updated')
