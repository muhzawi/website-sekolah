import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading.jsx'
import { programs, schoolImage } from '../data/schoolData.js'

export function ProfilePage() {
  const missions = [
    'Mengembangkan kurikulum yang relevan dengan kebutuhan industri dan perkembangan teknologi.',
    'Meningkatkan kualitas pembelajaran melalui praktik lapangan, proyek berbasis industri, dan pendampingan guru profesional.',
    'Membangun karakter siswa yang tangguh, disiplin, dan memiliki etos kerja yang kuat.',
    'Mengembangkan kerja sama dengan dunia usaha dan industri untuk meningkatkan daya serap lulusan.',
    'Menjaga kualitas layanan pendidikan dan fasilitas sekolah agar tetap relevan dan mendukung proses belajar.',
  ]

  return (
    <>
      <PageHeading breadcrumbs={['Beranda', 'Profil Sekolah']} title="Profil Sekolah" />
      <section className="profile-about surface content-card">
        <div>
          <h2>Tentang Kami</h2>
          <p>
            SMK Negeri 1 Nusantara adalah sekolah vokasi yang berfokus pada
            pengembangan keterampilan praktis, penguasaan teknologi, dan
            karakter profesional. Kami berkomitmen untuk menghasilkan lulusan
            yang siap kerja, memiliki etos kerja tinggi, dan mampu bersaing di
            industri yang terus berubah.
          </p>
          <p>
            Dengan lingkungan belajar yang kondusif, fasilitas praktik yang
            memadai, dan pendampingan guru yang berpengalaman, sekolah ini
            menjadi pilihan bagi siswa yang ingin menyiapkan diri untuk terjun
            langsung ke dunia kerja dan melanjutkan ke jenjang pendidikan tinggi.
          </p>
        </div>
        <img src={schoolImage} alt="Gedung utama dan halaman SMK Negeri 1 Nusantara" />
      </section>

      <section className="profile-vision surface content-card">
        <h2>Visi &amp; Misi</h2>
        <p>
          Menjadi sekolah vokasi unggulan yang menghasilkan lulusan siap kerja,
          berdaya saing tinggi, dan memiliki integritas akademik yang kuat.
        </p>
        <ol>
          {missions.map((mission) => <li key={mission}>{mission}</li>)}
        </ol>
      </section>
    </>
  )
}

export function ProgramsPage() {
  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'Program Keahlian']}
        title="Program Keahlian"
        description="Program keahlian kami dirancang untuk mempersiapkan lulusan yang siap kerja, terampil, dan memiliki kompetensi yang relevan dengan industri."
        size="large"
      />
      <div className="program-list">
        {programs.slice(0, 3).map((program, index) => (
          <article className="program-row surface" key={program.title}>
            <img
              className={index === 1 ? 'program-row-image image-right' : 'program-row-image'}
              src={program.image}
              alt={`Kegiatan pembelajaran program ${program.title}`}
            />
            <div className="program-row-content">
              <h2>{program.title}</h2>
              <p>{program.description}</p>
              <ul>
                {program.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
