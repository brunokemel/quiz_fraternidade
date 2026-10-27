import { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { questionBank } from './questions'

const QUIZ_LENGTH = 10
const LETTERS = ['A', 'B', 'C', 'D']
const STORAGE_KEY = 'quiz-fraternidade-perfis'

function loadProfiles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistProfiles(profiles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  } catch {
    // O quiz continua funcionando mesmo se o navegador bloquear o armazenamento local.
  }
}

function shuffle(items) {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }

  return copy
}

function prepareQuestions() {
  return shuffle(questionBank)
    .slice(0, QUIZ_LENGTH)
    .map((question) => {
      const options = shuffle(
        question.o.map((text, index) => ({ text, correct: index === question.c })),
      )

      return {
        ...question,
        options,
        correctIndex: options.findIndex((option) => option.correct),
      }
    })
}

function getResultMessage(score) {
  if (score === QUIZ_LENGTH) return 'Excelente! Você dominou o conteúdo!'
  if (score >= 8) return 'Muito bem! Você entendeu os principais conceitos.'
  if (score >= 6) return 'Bom trabalho! Revise as explicações para melhorar.'
  return 'Continue estudando! Reveja as explicações e tente novamente.'
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    color-scheme: light;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    color: #123f54;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #eaf4ff;
  }

  button {
    font: inherit;
  }

  button:focus-visible {
    outline: 3px solid rgba(10, 122, 152, 0.28);
    outline-offset: 3px;
  }
`

const Page = styled.main`
  position: relative;
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 18px;
  isolation: isolate;

  &::before {
    position: fixed;
    z-index: -1;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(235, 246, 255, 0.38), rgba(235, 246, 255, 0.48)),
      url("https://upload.wikimedia.org/wikipedia/commons/0/08/Beata_Savina_Petrilli.jpg"),
      url("https://3.bp.blogspot.com/-sO_Zb-5neOE/VTFP4E4QDXI/AAAAAAAAFgY/gXFq3NvGR28/s1600/Beata%2BSavina%2BPetrilli%2B2.jpg");
    background-repeat: no-repeat;
    background-position: center, left 2% top 8%, right 2% bottom 8%;
    background-size: cover, min(34vw, 310px) auto, min(34vw, 330px) auto;
    content: '';
  }

  @media (max-width: 640px) {
    padding: 14px;

    &::before {
      background-image:
        linear-gradient(rgba(235, 246, 255, 0.22), rgba(235, 246, 255, 0.3)),
        url("https://upload.wikimedia.org/wikipedia/commons/0/08/Beata_Savina_Petrilli.jpg");
      background-position: center, center top 1%;
      background-size: cover, 230px auto;
    }
  }
`

const Card = styled.section`
  width: min(100%, ${({ $wide }) => ($wide ? '720px' : '440px')});
  padding: 24px;
  border: 2px solid #168bb8;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 12px 35px rgba(7, 84, 123, 0.21);
`

const Header = styled.header`
  margin-bottom: 20px;
  text-align: center;
`

const Logo = styled.div`
  display: flex;
  width: 110px;
  height: 110px;
  margin: 0 auto 12px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid #168bb8;
  border-radius: 50%;
  background: #fff;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const Title = styled.h1`
  margin: 8px 0;
  color: #087eae;
  font-size: 24px;
`

const Subtitle = styled.p`
  margin: 8px 0 20px;
  color: #39748e;
  font-size: 1rem;
`

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  color: #386b80;
  font-size: 0.9rem;
  font-weight: 700;
`

const ProgressTrack = styled.div`
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #dcedf3;
`

const ProgressBar = styled.div`
  width: ${({ $value }) => $value}%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #087eae, #3bc2cf);
  transition: width 260ms ease;
`

const Question = styled.h2`
  margin: 22px 0;
  color: #164766;
  font-size: 19px;
  line-height: 1.4;
`

const Options = styled.div`
  display: grid;
  gap: 10px;
`

const OptionButton = styled.button`
  display: block;
  width: 100%;
  padding: 13px;
  border: 2px solid
    ${({ $state }) =>
      $state === 'correct' ? '#2a9d61' : $state === 'wrong' ? '#d84d4d' : '#c7e6ef'};
  border-radius: 13px;
  color: #164766;
  background: ${({ $state }) =>
    $state === 'correct' ? '#dcf8e6' : $state === 'wrong' ? '#ffe4e4' : '#f7fcfe'};
  text-align: left;
  line-height: 1.4;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;

  &:hover:not(:disabled) {
    border-color: #4bb1cc;
    background: #edf9fc;
    transform: translateY(-1px);
  }
`

const Feedback = styled.div`
  min-height: 66px;
  margin: 17px 0 8px;
  padding: ${({ $visible }) => ($visible ? '12px 14px' : '0')};
  border-radius: 12px;
  color: ${({ $correct }) => ($correct ? '#176f40' : '#9c3030')};
  background: ${({ $correct }) => ($correct ? '#eefbf3' : '#fff2f2')};
  font-size: 0.92rem;
  line-height: 1.5;
`

const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px 18px;
  border: 0;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(90deg, #087eae, #13a9ca);
  box-shadow: 0 10px 22px rgba(8, 126, 174, 0.2);
  font-weight: 800;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    box-shadow: 0 13px 26px rgba(8, 126, 174, 0.26);
    transform: translateY(-1px);
  }
`

const ProfileForm = styled.form`
  display: grid;
  gap: 10px;
  margin-bottom: 22px;
`

const NameInput = styled.input`
  width: 100%;
  padding: 13px 14px;
  border: 2px solid #c5e5f2;
  border-radius: 13px;
  color: #164766;
  background: #f9fdff;
  font: inherit;

  &:focus {
    border-color: #168bb8;
    outline: none;
    box-shadow: 0 0 0 3px rgba(22, 139, 184, 0.14);
  }
`

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: #164766;
  font-size: 1.1rem;
`

const IntroArticle = styled.article`
  color: #164766;

  h2 {
    margin: 0 0 18px;
    color: #087eae;
    font-size: clamp(1.35rem, 4vw, 1.75rem);
    line-height: 1.25;
    text-align: center;
  }

  p {
    margin: 0 0 16px;
    font-size: 1rem;
    line-height: 1.7;
    text-align: justify;
  }
`

const IntroButtonArea = styled.div`
  max-width: 380px;
  margin: 24px auto 0;
`

const ProfileList = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 22px;
`

const ProfileButton = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 2px solid #c5e5f2;
  border-radius: 13px;
  color: #164766;
  background: #f4fbff;
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: #168bb8;
  }

  span:last-child {
    color: #087eae;
    font-weight: 800;
    white-space: nowrap;
  }
`

const Ranking = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`

const RankingItem = styled.li`
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 10px 6px;
  border-bottom: 1px solid #d8edf7;

  &:last-child {
    border-bottom: 0;
  }

  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span:last-child {
    color: #087eae;
    font-weight: 900;
  }
`

const SecondaryButton = styled.button`
  width: 100%;
  margin-top: 10px;
  padding: 12px 16px;
  border: 2px solid #168bb8;
  border-radius: 13px;
  color: #087eae;
  background: #fff;
  font-weight: 800;
  cursor: pointer;
`

const Result = styled.div`
  padding: 12px 0 2px;
  text-align: center;

  h2 {
    margin: 0 0 8px;
    color: #123f54;
    font-size: 1.55rem;
  }

  p {
    margin: 8px auto 24px;
    max-width: 400px;
    color: #51798a;
    line-height: 1.55;
  }
`

const Score = styled.div`
  margin: 14px 0 6px;
  color: #087eae;
  font-size: clamp(3.2rem, 14vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.07em;
`

const Footer = styled.footer`
  margin-top: 25px;
  color: #618293;
  font-size: 0.82rem;
  text-align: center;
`

export default function App() {
  const [introSeen, setIntroSeen] = useState(false)
  const [profiles, setProfiles] = useState(loadProfiles)
  const [activeProfileId, setActiveProfileId] = useState(null)
  const [name, setName] = useState('')
  const [questions, setQuestions] = useState(prepareQuestions)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentIndex]
  const answered = selectedIndex !== null
  const selectedCorrectly = answered && selectedIndex === currentQuestion.correctIndex
  const progress = ((currentIndex + (answered ? 1 : 0)) / QUIZ_LENGTH) * 100
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId)
  const ranking = [...profiles]
    .filter((profile) => profile.attempts > 0)
    .sort((first, second) => second.bestScore - first.bestScore || first.name.localeCompare(second.name))

  function resetQuiz() {
    setQuestions(prepareQuestions())
    setCurrentIndex(0)
    setScore(0)
    setSelectedIndex(null)
    setFinished(false)
  }

  function startWithProfile(profileId) {
    setActiveProfileId(profileId)
    resetQuiz()
  }

  function createProfile(event) {
    event.preventDefault()
    const cleanName = name.trim().slice(0, 30)
    if (!cleanName) return

    const existing = profiles.find(
      (profile) => profile.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase(),
    )

    if (existing) {
      setName('')
      startWithProfile(existing.id)
      return
    }

    const profile = {
      id: crypto.randomUUID(),
      name: cleanName,
      bestScore: 0,
      lastScore: 0,
      attempts: 0,
    }
    const updatedProfiles = [...profiles, profile]
    setProfiles(updatedProfiles)
    persistProfiles(updatedProfiles)
    setName('')
    startWithProfile(profile.id)
  }

  function saveResult(finalScore) {
    setProfiles((currentProfiles) => {
      const updatedProfiles = currentProfiles.map((profile) =>
        profile.id === activeProfileId
          ? {
              ...profile,
              bestScore: Math.max(profile.bestScore, finalScore),
              lastScore: finalScore,
              attempts: profile.attempts + 1,
            }
          : profile,
      )
      persistProfiles(updatedProfiles)
      return updatedProfiles
    })
  }

  function answerQuestion(optionIndex) {
    if (answered) return

    setSelectedIndex(optionIndex)
    if (optionIndex === currentQuestion.correctIndex) setScore((value) => value + 1)
  }

  function goToNextQuestion() {
    if (currentIndex === QUIZ_LENGTH - 1) {
      saveResult(score)
      setFinished(true)
      return
    }

    setCurrentIndex((value) => value + 1)
    setSelectedIndex(null)
  }

  function restartQuiz() {
    resetQuiz()
  }

  function returnToProfiles() {
    setActiveProfileId(null)
    resetQuiz()
  }

  function getOptionState(optionIndex) {
    if (!answered) return 'idle'
    if (optionIndex === currentQuestion.correctIndex) return 'correct'
    if (optionIndex === selectedIndex) return 'wrong'
    return 'idle'
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Card $wide={!introSeen} aria-live="polite">
          <Header>
            <Logo><img src="/logo-colegio.jpg" alt="Logotipo do Colégio Nossa Senhora do Ó" /></Logo>
            <Title>Quiz da Fraternidade</Title>
            <Subtitle>Colégio Nossa Senhora do Ó • Nível intermediário</Subtitle>
          </Header>

          {!introSeen ? (
            <IntroArticle>
              <h2>🏠 Moradia Digna e a Campanha da Fraternidade</h2>
              <p>
                A moradia digna é um direito fundamental de todas as pessoas. Ter uma casa adequada é essencial para viver com saúde, segurança, conforto e respeito. Uma moradia digna deve oferecer proteção contra o frio, o calor e a chuva, além de ter água potável, energia elétrica, saneamento básico e condições adequadas de higiene. Ter um lar também ajuda as famílias a viverem com mais tranquilidade e qualidade de vida.
              </p>
              <p>
                Infelizmente, muitas pessoas no Brasil não possuem uma moradia adequada. Algumas famílias vivem em casas pequenas, com infiltrações, sem saneamento básico ou em locais que apresentam riscos. Outras pessoas não têm casa e precisam viver nas ruas ou em abrigos. Essa realidade mostra que ainda existe muita desigualdade social em nosso país.
              </p>
              <p>
                A falta de moradia digna pode trazer diversos problemas para a população. A ausência de água tratada e de saneamento básico pode causar doenças. Além disso, crianças que vivem em condições precárias podem enfrentar dificuldades para estudar, descansar e realizar suas atividades diárias. Por isso, garantir uma moradia adequada é uma forma de proteger a saúde, a educação e o bem-estar das pessoas.
              </p>
              <p>
                A Campanha da Fraternidade, promovida pela Igreja Católica, busca conscientizar a sociedade sobre problemas sociais e incentivar atitudes de solidariedade. Por meio de suas reflexões, ela nos convida a olhar com atenção para as pessoas que enfrentam dificuldades e a reconhecer que todos merecem viver com dignidade. A campanha também nos ensina a importância do amor ao próximo, da partilha e da responsabilidade com aqueles que mais precisam.
              </p>
              <IntroButtonArea>
                <PrimaryButton type="button" onClick={() => setIntroSeen(true)}>
                  Continuar para o quiz →
                </PrimaryButton>
              </IntroButtonArea>
            </IntroArticle>
          ) : !activeProfile ? (
            <div>
              <SectionTitle>Criar perfil</SectionTitle>
              <ProfileForm onSubmit={createProfile}>
                <NameInput
                  type="text"
                  value={name}
                  maxLength="30"
                  placeholder="Digite seu nome"
                  aria-label="Nome do jogador"
                  onChange={(event) => setName(event.target.value)}
                />
                <PrimaryButton type="submit">Criar perfil e jogar</PrimaryButton>
              </ProfileForm>

              {profiles.length > 0 && (
                <>
                  <SectionTitle>Quem vai jogar?</SectionTitle>
                  <ProfileList>
                    {profiles.map((profile) => (
                      <ProfileButton
                        key={profile.id}
                        type="button"
                        onClick={() => startWithProfile(profile.id)}
                      >
                        <strong>{profile.name}</strong>
                        <span>{profile.attempts ? `${profile.bestScore}/10` : 'Novo'}</span>
                      </ProfileButton>
                    ))}
                  </ProfileList>
                </>
              )}

              {ranking.length > 0 && (
                <>
                  <SectionTitle>🏆 Ranking</SectionTitle>
                  <Ranking>
                    {ranking.map((profile, index) => (
                      <RankingItem key={profile.id}>
                        <span>{index + 1}º</span>
                        <strong>{profile.name}</strong>
                        <span>{profile.bestScore}/10</span>
                      </RankingItem>
                    ))}
                  </Ranking>
                </>
              )}
            </div>
          ) : finished ? (
            <Result>
              <h2>Quiz concluído! 🎉</h2>
              <p><strong>{activeProfile.name}</strong></p>
              <Score>{score}/10</Score>
              <p>{getResultMessage(score)}</p>
              <SectionTitle>🏆 Ranking</SectionTitle>
              <Ranking>
                {ranking.map((profile, index) => (
                  <RankingItem key={profile.id}>
                    <span>{index + 1}º</span>
                    <strong>{profile.name}</strong>
                    <span>{profile.bestScore}/10</span>
                  </RankingItem>
                ))}
              </Ranking>
              <PrimaryButton type="button" onClick={restartQuiz}>
                Jogar novamente
              </PrimaryButton>
              <SecondaryButton type="button" onClick={returnToProfiles}>
                Trocar de perfil
              </SecondaryButton>
            </Result>
          ) : (
            <>
              <Info>
                <span>{activeProfile.name} • {currentIndex + 1}/{QUIZ_LENGTH}</span>
                <span>⭐ {score} {score === 1 ? 'ponto' : 'pontos'}</span>
              </Info>
              <ProgressTrack
                aria-label={`Progresso: ${Math.round(progress)}%`}
                aria-valuemax="100"
                aria-valuemin="0"
                aria-valuenow={progress}
                role="progressbar"
              >
                <ProgressBar $value={progress} />
              </ProgressTrack>

              <Question>{currentQuestion.p}</Question>
              <Options>
                {currentQuestion.options.map((option, optionIndex) => (
                  <OptionButton
                    key={option.text}
                    type="button"
                    disabled={answered}
                    $state={getOptionState(optionIndex)}
                    onClick={() => answerQuestion(optionIndex)}
                  >
                    {LETTERS[optionIndex]}) {option.text}
                  </OptionButton>
                ))}
              </Options>

              <Feedback $visible={answered} $correct={selectedCorrectly}>
                {answered && (
                  <><strong>{selectedCorrectly ? 'Acertou!' : 'Não foi dessa vez.'}</strong>{' '}{currentQuestion.e}</>
                )}
              </Feedback>

              {answered && (
                <PrimaryButton type="button" onClick={goToNextQuestion}>
                  {currentIndex === QUIZ_LENGTH - 1 ? 'Ver resultado' : 'Próxima questão'} →
                </PrimaryButton>
              )}
            </>
          )}

          <Footer>Respeito • Solidariedade • Fraternidade</Footer>
        </Card>
      </Page>
    </>
  )
}
