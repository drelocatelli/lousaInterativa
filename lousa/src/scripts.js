
    (() => {
      const canvas = document.getElementById('iso-canvas');
      const ctx = canvas.getContext('2d');
      const diagCanvas = document.getElementById('board-diagram-canvas');
      const diagCtx = diagCanvas.getContext('2d');

      const GRID_W = 12;
      const GRID_H = 10;
      let TILE_W = 68;
      let TILE_H = 34;
      let Z_SCALE = 42;

      const camera = {
        rotation: 0, // 0: Norte, 1: Leste, 2: Sul, 3: Oeste
        offsetX: 0,
        offsetY: 0,
        nightMode: false
      };

      const ROT_LABELS = ['NORTE', 'LESTE', 'SUL', 'OESTE'];

      // Catálogo Completo de Assuntos (Com Estatística em destaque!)
      const SUBJECTS = {
        est: {
          name: "📊 Estatística & Probabilidade",
          steps: [
            {
              shortName: "1. Média, Mediana e Moda",
              chalkTop: "ESTATÍSTICA — TENDÊNCIA CENTRAL",
              chalkMain: "x̄ = (Σxᵢ)/n  |  Amostra: {4, 6, 7, 7, 11} -> x̄=7, Md=7, Mo=7",
              speech: "Turma, em Estatística começamos pelas medidas de tendência central: Média Aritmética (x̄), Mediana (centro do rol) e Moda (valor que mais se repete)!",
              tip: "💡 Dica: Sempre ordene os dados em Rol crescente antes de calcular a Mediana!",
              diagramType: "bars",
              diagramCaption: "Histograma de Frequências da Amostra",
              boardX: 4.8
            },
            {
              shortName: "2. Variância e Desvio Padrão",
              chalkTop: "ESTATÍSTICA — MEDIDAS DE DISPERSÃO",
              chalkMain: "σ² = Σ(xᵢ - x̄)² / n     |     Desvio Padrão: σ = √σ²",
              speech: "Duas turmas podem ter a mesma média 7, mas notas muito espalhadas! A Variância (σ²) e o Desvio Padrão (σ) medem exatamente essa regularidade!",
              tip: "💡 Quanto menor o Desvio Padrão (σ), mais homogêneo e regular é o conjunto de dados.",
              diagramType: "scatter",
              diagramCaption: "Dispersão dos dados em torno da Média (x̄)",
              boardX: 6.1
            },
            {
              shortName: "3. Curva Normal (Gaussiana)",
              chalkTop: "DISTRIBUIÇÃO NORMAL (GAUSS)",
              chalkMain: "Simétrica: x̄ = Md = Mo   |   68% entre [x̄ - σ, x̄ + σ]",
              speech: "Olhem o sino de Gauss no quadro! Numa distribuição normal, cerca de 68% dos dados ficam a 1 desvio padrão da média, e 95% ficam dentro de 2 desvios!",
              tip: "💡 Regra Empírica (68-95-99,7%): fundamental para inferência estatística e intervalos de confiança.",
              diagramType: "gauss",
              diagramCaption: "Curva de Gauss: 68% em ±1σ | 95% em ±2σ",
              boardX: 5.4
            },
            {
              shortName: "4. Probabilidade & Amostragem",
              chalkTop: "PROBABILIDADE — ESPAÇO AMOSTRAL (Ω)",
              chalkMain: "P(A) = n(A) / n(Ω)    |    0 ≤ P(A) ≤ 1  (ou 0% a 100%)",
              speech: "Para fechar: a probabilidade de um evento A é a razão entre os casos favoráveis n(A) e o total de casos possíveis do espaço amostral Ω!",
              tip: "💡 Eventos independentes: P(A ∩ B) = P(A) · P(B). Já a soma de todos os eventos elementares é sempre 100%.",
              diagramType: "venn",
              diagramCaption: "Espaço Amostral Ω e Diagrama de Eventos A ∪ B",
              boardX: 4.1
            }
          ],
          qa: [
            { q: "Professor, quando é melhor usar a Mediana em vez da Média?", a: "Excelente pergunta! Quando há valores discrepantes (outliers), como salários muito altos que distorcem a média, a Mediana representa melhor o grupo!" },
            { q: "Por que elevamos (xᵢ - x̄) ao quadrado na Variância?", a: "Porque se somarmos apenas os desvios (xᵢ - x̄), os positivos anulam os negativos e a soma dá sempre zero!" },
            { q: "Uma distribuição pode ter mais de uma Moda?", a: "Pode sim! Se dois valores empatam na maior frequência, chamamos a série de Bimodal!" }
          ]
        },
        mat: {
          name: "📐 Matemática (Função Quadrática)",
          steps: [
            {
              shortName: "1. Discriminante Delta",
              chalkTop: "MATEMÁTICA — FUNÇÃO QUADRÁTICA",
              chalkMain: "x² - 5x + 6 = 0    |    Δ = b² - 4ac = (-5)² - 24 = 1",
              speech: "Atenção, turma! Para achar as raízes de x² - 5x + 6 = 0, começamos calculando o discriminante Delta!",
              tip: "💡 Se Δ > 0 temos 2 raízes reais; se Δ = 0 temos 1 raiz dupla; se Δ < 0 não há raízes reais.",
              diagramType: "parabola",
              diagramCaption: "Parábola f(x) = x² - 5x + 6 cortando X em 2 e 3",
              boardX: 4.8
            },
            {
              shortName: "2. Fórmula de Bhaskara",
              chalkTop: "PASSO 2: FÓRMULA DE BHASKARA",
              chalkMain: "x = (-b ± √Δ) / 2a   =>   x' = 2  e  x'' = 3",
              speech: "Aplicando x = (5 ± 1) / 2, chegamos em x' = 2 e x'' = 3! Anotem no caderno!",
              tip: "💡 Soma das raízes: S = -b/a = 5. Produto das raízes: P = c/a = 6.",
              diagramType: "parabola",
              diagramCaption: "Raízes x' = 2 e x'' = 3 no eixo horizontal",
              boardX: 6.1
            },
            {
              shortName: "3. Vértice da Parábola",
              chalkTop: "PONTO DE MÍNIMO (VÉRTICE)",
              chalkMain: "Xv = -b/2a = 2,5   |   Yv = -Δ/4a = -0,25",
              speech: "O vértice fica exatamente no eixo de simetria entre as duas raízes: Xv = 2,5 e Yv = -0,25!",
              tip: "💡 Como a > 0 (a = 1), a parábola tem concavidade voltada para cima e possui ponto de mínimo.",
              diagramType: "parabola",
              diagramCaption: "Vértice V(2.5, -0.25) como ponto mínimo",
              boardX: 5.3
            }
          ],
          qa: [
            { q: "Professor, e se o Delta der negativo?", a: "Ótima pergunta! Se Δ < 0, a parábola não encosta no eixo X e não possui raízes reais!" },
            { q: "Pode resolver por Soma e Produto?", a: "Claro! Dois números que somados dão 5 e multiplicados dão 6: só podem ser 2 e 3!" }
          ]
        },
        fis: {
          name: "🍎 Física (As Leis de Newton)",
          steps: [
            {
              shortName: "1. Lei da Inércia",
              chalkTop: "FÍSICA — 1ª LEI DE NEWTON",
              chalkMain: "1ª Lei (Inércia):  ΣF = 0  <=>  Repouso ou MRU",
              speech: "Na 1ª Lei de Newton, todo corpo tende a manter seu estado de repouso ou movimento retilíneo uniforme se a força resultante for nula!",
              tip: "💡 A massa é a medida quantitativa da inércia de um corpo.",
              diagramType: "vectors",
              diagramCaption: "Equilíbrio de forças: Normal (N) e Peso (P)",
              boardX: 5.0
            },
            {
              shortName: "2. Princípio Fundamental",
              chalkTop: "2ª LEI DE NEWTON (DINÂMICA)",
              chalkMain: "Fr = m · a     |     Unidade SI: 1 N = 1 kg·m/s²",
              speech: "A Força Resultante é igual ao produto da massa pela aceleração! Dobrando a força, dobramos a aceleração!",
              tip: "💡 Força e aceleração são grandezas vetoriais que apontam sempre no mesmo sentido.",
              diagramType: "vectors",
              diagramCaption: "Bloco sob ação de Força Resultante Fr -> a",
              boardX: 6.2
            },
            {
              shortName: "3. Ação e Reação",
              chalkTop: "3ª LEI DE NEWTON (AÇÃO E REAÇÃO)",
              chalkMain: "F(A->B) = - F(B->A)   (Corpos distintos, sentidos opostos)",
              speech: "Ação e reação nunca se equilibram porque estão aplicadas em corpos diferentes!",
              tip: "💡 Exemplo: a Terra atrai a Lua e a Lua atrai a Terra com forças de mesma intensidade.",
              diagramType: "vectors",
              diagramCaption: "Par Ação-Reação em sentidos opostos",
              boardX: 4.3
            }
          ],
          qa: [
            { q: "Professor, peso e massa são a mesma coisa?", a: "Cuidado! Massa é escalar em kg; Peso é força gravitacional (P = m·g) medida em Newtons!" }
          ]
        },
        his: {
          name: "🚂 História (Revolução Industrial)",
          steps: [
            {
              shortName: "1. Pioneirismo Inglês",
              chalkTop: "HISTÓRIA — REVOLUÇÃO INDUSTRIAL (1760)",
              chalkMain: "Inglaterra: Carvão Mineral + Ferro + Lei dos Cercamentos",
              speech: "No século XVIII, a Inglaterra reunia reservas de carvão, capital acumulado e mão de obra vinda do êxodo rural!",
              tip: "💡 Os Cercamentos (Enclosure Acts) transformaram terras comunais em pastagens para ovelhas (lã).",
              diagramType: "timeline",
              diagramCaption: "Linha do Tempo das Revoluções Industriais",
              boardX: 5.0
            },
            {
              shortName: "2. Máquina a Vapor",
              chalkTop: "DA MANUFATURA À MAQUINOFATURA",
              chalkMain: "James Watt (1769): Máquina a Vapor -> Teares e Locomotivas",
              speech: "A máquina a vapor substituiu a força humana e hidráulica, revolucionando a produção têxtil e o transporte!",
              tip: "💡 A divisão técnica do trabalho aumentou drasticamente a produtividade das fábricas.",
              diagramType: "timeline",
              diagramCaption: "Evolução da Produção: Artesanato -> Maquinofatura",
              boardX: 6.2
            }
          ],
          qa: [
            { q: "O que foi o movimento Ludista, professor?", a: "Os ludistas eram operários que quebravam máquinas em protesto contra o desemprego e as jornadas de 16 horas!" }
          ]
        },
        bio: {
          name: "🧬 Biologia (Citologia & Energia)",
          steps: [
            {
              shortName: "1. Célula Eucariótica",
              chalkTop: "BIOLOGIA — CITOLOGIA E ORGANELAS",
              chalkMain: "Eucariontes: Membrana Plasmática + Citoplasma + Núcleo (DNA)",
              speech: "Diferente das bactérias procariontes, nossas células possuem carioteca protegendo o material genético!",
              tip: "💡 Ribossomos estão presentes tanto em células procariontes quanto eucarióticas.",
              diagramType: "cell",
              diagramCaption: "Esquema da Célula Eucariótica e Mitocôndria",
              boardX: 4.9
            },
            {
              shortName: "2. Respiração Celular",
              chalkTop: "MITOCÔNDRIAS & SÍNTESE DE ATP",
              chalkMain: "C₆H₁₂O₆ + 6 O₂  -->  6 CO₂ + 6 H₂O + Energia (ATP)",
              speech: "As mitocôndrias realizam a respiração celular aeróbica: quebram a glicose na presença de oxigênio para gerar ATP!",
              tip: "💡 Etapas: Glicólise (citosol), Ciclo de Krebs (matriz) e Cadeia Respiratória (cristas).",
              diagramType: "cell",
              diagramCaption: "Mitocôndria: Cristas e Matriz Mitocondrial",
              boardX: 6.1
            }
          ],
          qa: [
            { q: "Por que a mitocôndria tem DNA próprio?", a: "Pela Teoria da Endossimbiose! Ela descende de antigas bactérias aeróbicas englobadas há bilhões de anos!" }
          ]
        }
      };

      const lectureState = {
        subjectKey: 'est', // Começa em Estatística!
        stepIndex: 0,
        stepTimer: 0,
        stepDuration: 9.0,
        chalkTop: SUBJECTS.est.steps[0].chalkTop,
        chalkMain: SUBJECTS.est.steps[0].chalkMain,
        qaIndex: 0
      };

      // Professor Motta
      const teacher = {
        x: 4.8,
        y: 0.95,
        z: 0.14,
        targetX: 4.8,
        targetY: 0.95,
        facing: { x: 0, y: 1 },
        walkCycle: 0,
        isMoving: false,
        writingAtBoard: false,
        speech: SUBJECTS.est.steps[0].speech,
        speechTimer: 8.5
      };

      // Jogador (Começa sentado na Carteira #5 no centro da sala)
      const player = {
        x: 5.52,
        y: 5.9,
        z: 0.25,
        speed: 3.5,
        radius: 0.27,
        facing: { x: 0, y: -1 },
        walkCycle: 0,
        isMoving: false,
        sittingOn: null,
        targetPos: null,
        handRaised: 0,
        speech: "",
        speechTimer: 0
      };

      const classmates = [];
      const props = [];
      const dustParticles = [];
      const floorRipples = [];

      for (let i = 0; i < 35; i++) {
        dustParticles.push({
          x: Math.random() * GRID_W,
          y: Math.random() * GRID_H,
          z: 0.3 + Math.random() * 2.5,
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.14,
          size: 1.2 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2
        });
      }

      const STUDENT_PROFILES = [
        { name: "Lucas", hair: "#2B1E16", skin: "#F2C19E", bag: "#C84B31", comment: "Calculando o desvio padrão na ponta do lápis..." },
        { name: "Marina", hair: "#6E2C1E", skin: "#F7D3BA", bag: "#2B72B8", comment: "Marina já montou o rol e achou a mediana!" },
        { name: "Pedro", hair: "#1A1A1A", skin: "#C68B59", bag: "#3E7A56", comment: "Pedro desenhou a curva de Gauss no caderno." },
        { name: "Bia", hair: "#D99B26", skin: "#F7D3BA", bag: "#8C4A7E", comment: "Bia está conferindo a tabela de frequências." },
        null, // Carteira #5: Jogador
        { name: "Rafael", hair: "#3B271A", skin: "#E0AC82", bag: "#D47A27", comment: "Rafael está tentando lembrar a diferença entre variância e desvio padrão..." },
        { name: "Giulia", hair: "#1F1B24", skin: "#F2C19E", bag: "#C84B31", comment: "Giulia coloriu as barras do histograma com marca-texto." },
        { name: "Tiago", hair: "#8C4A27", skin: "#F7D3BA", bag: "#284B63", comment: "Tiago está anotando as fórmulas do quadro-negro." },
        { name: "Sofia", hair: "#181412", skin: "#B5784A", bag: "#3E7A56", comment: "Sofia está super atenta à explicação do Prof. Motta." }
      ];

      function buildClassroom() {
        props.length = 0;
        classmates.length = 0;

        props.push({
          id: 'platform',
          type: 'platform',
          x: 2.1, y: 0.35, w: 6.4, d: 2.0, h: 0.14,
          solid: false
        });

        props.push({
          id: 'teacher_desk',
          type: 'teacher_desk',
          x: 2.25, y: 0.95, w: 1.95, d: 0.88, h: 0.78,
          solid: true
        });

        props.push({
          id: 'teacher_chair',
          type: 'chair',
          x: 2.92, y: 0.36, w: 0.62, d: 0.56, h: 0.86,
          solid: true,
          isTeacherChair: true,
          seatDir: { x: 0, y: 1 }
        });

        props.push({
          id: 'lockers',
          type: 'lockers',
          x: 8.85, y: 0.22, w: 2.65, d: 0.82, h: 2.05,
          solid: true
        });

        props.push({
          id: 'trash_bin',
          type: 'trash_bin',
          x: 10.6, y: 1.55, w: 0.62, d: 0.62, h: 0.68,
          solid: true
        });

        props.push({
          id: 'bookshelf',
          type: 'bookshelf',
          x: 0.18, y: 0.35, w: 0.82, d: 1.95, h: 1.95,
          solid: true
        });

        const cols = [2.4, 5.2, 8.0];
        const rows = [3.1, 5.1, 7.1];

        let idx = 0;
        for (let r = 0; r < rows.length; r++) {
          for (let c = 0; c < cols.length; c++) {
            const dx = cols[c];
            const dy = rows[r];
            const profile = STUDENT_PROFILES[idx];
            const deskNum = idx + 1;

            props.push({
              id: `desk_${deskNum}`,
              type: 'student_desk',
              deskNumber: deskNum,
              x: dx, y: dy, w: 1.18, d: 0.72, h: 0.72,
              solid: true,
              hasOpenBook: true,
              hasPencilCase: (deskNum % 2 === 0)
            });

            const chairObj = {
              id: `chair_${deskNum}`,
              type: 'chair',
              deskNumber: deskNum,
              x: dx + 0.27, y: dy + 0.76, w: 0.64, d: 0.58, h: 0.80,
              solid: true,
              seatDir: { x: 0, y: -1 },
              occupant: profile
            };
            props.push(chairObj);

            if (profile) {
              classmates.push({
                ...profile,
                deskIndex: deskNum,
                chair: chairObj,
                x: chairObj.x + chairObj.w / 2,
                y: chairObj.y + chairObj.d / 2,
                z: 0.25,
                phase: idx * 1.3,
                handRaisedTimer: 0,
                speech: "",
                speechTimer: 0
              });
            } else {
              player.myChair = chairObj;
              player.sittingOn = chairObj;
              player.x = chairObj.x + chairObj.w / 2;
              player.y = chairObj.y + chairObj.d / 2;
              player.z = 0.25;
              player.facing = { x: 0, y: -1 };
            }

            idx++;
          }
        }
      }

      buildClassroom();

      // Controle de Seleção de Assunto e Tópicos
      function setSubject(subKey, stepIdx = 0) {
        lectureState.subjectKey = subKey;
        lectureState.stepIndex = stepIdx;
        lectureState.stepTimer = 0;
        applyLectureStep();

        document.getElementById('subject-select').value = subKey;
        document.getElementById('modal-subject-select').value = subKey;

        document.querySelectorAll('.sub-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-subject') === subKey);
        });

        syncBoardModalUI();
      }

      function changeStep(delta) {
        const sub = SUBJECTS[lectureState.subjectKey];
        lectureState.stepIndex = (lectureState.stepIndex + delta + sub.steps.length) % sub.steps.length;
        lectureState.stepTimer = 0;
        applyLectureStep();
        syncBoardModalUI();
      }

      function applyLectureStep() {
        const sub = SUBJECTS[lectureState.subjectKey];
        const step = sub.steps[lectureState.stepIndex];
        lectureState.chalkTop = step.chalkTop;
        lectureState.chalkMain = step.chalkMain;

        document.getElementById('lesson-topic-label').textContent =
          `Tópico ${lectureState.stepIndex + 1}/${sub.steps.length}: ${step.shortName.replace(/^\d+\.\s*/, '')}`;

        teacher.targetX = step.boardX;
        teacher.targetY = 0.85;
        teacher.speech = step.speech;
        teacher.speechTimer = lectureState.stepDuration - 0.5;
        teacher.writingAtBoard = true;

        setTimeout(() => {
          teacher.writingAtBoard = false;
        }, 2000);
      }

      // Modal do Quadro-Negro Ampliado + Gráfico Desenhado a Giz
      function openBoardModal() {
        syncBoardModalUI();
        document.getElementById('board-modal').classList.add('open');
      }

      function closeBoardModal() {
        document.getElementById('board-modal').classList.remove('open');
      }

      function syncBoardModalUI() {
        const sub = SUBJECTS[lectureState.subjectKey];
        const step = sub.steps[lectureState.stepIndex];

        document.getElementById('modal-subject-title').textContent = sub.name;
        document.getElementById('modal-step-tag').textContent =
          `TÓPICO ${lectureState.stepIndex + 1} DE ${sub.steps.length} • ${step.chalkTop}`;
        document.getElementById('modal-formula').textContent = step.chalkMain;
        document.getElementById('modal-explanation').textContent = step.speech;
        document.getElementById('modal-extra-note').textContent = step.tip;
        document.getElementById('modal-diagram-caption').textContent = step.diagramCaption;

        const pillsContainer = document.getElementById('modal-step-pills');
        pillsContainer.innerHTML = '';
        sub.steps.forEach((st, idx) => {
          const btn = document.createElement('button');
          btn.className = 'step-pill' + (idx === lectureState.stepIndex ? ' active' : '');
          btn.textContent = st.shortName;
          btn.onclick = () => {
            lectureState.stepIndex = idx;
            lectureState.stepTimer = 0;
            applyLectureStep();
            syncBoardModalUI();
          };
          pillsContainer.appendChild(btn);
        });

        drawChalkDiagram(step.diagramType);
      }

      // Desenha os gráficos a giz dentro da Modal do Quadro-Negro (Histograma, Curva de Gauss, Dispersão, Parábola, etc.)
      function drawChalkDiagram(type) {
        const w = diagCanvas.width;
        const h = diagCanvas.height;
        diagCtx.clearRect(0, 0, w, h);

        diagCtx.strokeStyle = 'rgba(244, 241, 234, 0.85)';
        diagCtx.fillStyle = 'rgba(244, 241, 234, 0.85)';
        diagCtx.lineWidth = 2;
        diagCtx.font = '12px "Architects Daughter", cursive';

        if (type === 'bars') {
          // Histograma de Estatística: {4, 6, 7, 7, 11}
          diagCtx.beginPath();
          diagCtx.moveTo(32, 18);
          diagCtx.lineTo(32, h - 26);
          diagCtx.lineTo(w - 20, h - 26);
          diagCtx.stroke();

          const data = [
            { label: 'x=4', val: 1, col: '#7CC6FE' },
            { label: 'x=6', val: 1, col: '#7CC6FE' },
            { label: 'x=7 (Mo/Md)', val: 2, col: '#F3C65F' },
            { label: 'x=11', val: 1, col: '#7CC6FE' }
          ];
          data.forEach((d, i) => {
            const bx = 52 + i * 52;
            const bh = d.val * 52;
            const by = (h - 26) - bh;
            diagCtx.fillStyle = d.col;
            diagCtx.globalAlpha = 0.35;
            diagCtx.fillRect(bx, by, 34, bh);
            diagCtx.globalAlpha = 1;
            diagCtx.strokeStyle = d.col;
            diagCtx.strokeRect(bx, by, 34, bh);

            diagCtx.fillStyle = '#F4F1EA';
            diagCtx.textAlign = 'center';
            diagCtx.fillText(d.label, bx + 17, h - 10);
            diagCtx.fillText(`f=${d.val}`, bx + 17, by - 6);
          });
          return;
        }

        if (type === 'gauss') {
          // Curva Normal (Sino de Gauss)
          const baseY = h - 28;
          const midX = w / 2;
          diagCtx.beginPath();
          diagCtx.moveTo(20, baseY);
          diagCtx.lineTo(w - 20, baseY);
          diagCtx.stroke();

          // Área preenchida ±1σ
          diagCtx.fillStyle = 'rgba(243, 198, 95, 0.22)';
          diagCtx.beginPath();
          diagCtx.moveTo(midX - 42, baseY);
          for (let x = midX - 42; x <= midX + 42; x += 2) {
            const z = (x - midX) / 42;
            const y = baseY - Math.exp(-0.5 * z * z) * 105;
            diagCtx.lineTo(x, y);
          }
          diagCtx.lineTo(midX + 42, baseY);
          diagCtx.closePath();
          diagCtx.fill();

          // Traçado do sino
          diagCtx.strokeStyle = '#F3C65F';
          diagCtx.lineWidth = 2.5;
          diagCtx.beginPath();
          for (let x = 24; x <= w - 24; x += 2) {
            const z = (x - midX) / 42;
            const y = baseY - Math.exp(-0.5 * z * z) * 105;
            if (x === 24) diagCtx.moveTo(x, y);
            else diagCtx.lineTo(x, y);
          }
          diagCtx.stroke();

          // Linhas tracejadas da Média e ±1σ
          diagCtx.setLineDash([4, 4]);
          diagCtx.strokeStyle = '#7CC6FE';
          [midX - 42, midX, midX + 42].forEach(lx => {
            diagCtx.beginPath();
            diagCtx.moveTo(lx, baseY);
            diagCtx.lineTo(lx, baseY - 105);
            diagCtx.stroke();
          });
          diagCtx.setLineDash([]);

          diagCtx.fillStyle = '#F4F1EA';
          diagCtx.textAlign = 'center';
          diagCtx.fillText('-1σ', midX - 42, baseY + 15);
          diagCtx.fillText('x̄ (Média)', midX, baseY + 15);
          diagCtx.fillText('+1σ', midX + 42, baseY + 15);
          diagCtx.fillStyle = '#F3C65F';
          diagCtx.fillText('68,2%', midX, baseY - 45);
          return;
        }

        if (type === 'scatter') {
          // Gráfico de desvios em relação à linha da média x̄
          const midY = h / 2;
          diagCtx.strokeStyle = '#F3C65F';
          diagCtx.setLineDash([5, 4]);
          diagCtx.beginPath();
          diagCtx.moveTo(25, midY);
          diagCtx.lineTo(w - 25, midY);
          diagCtx.stroke();
          diagCtx.setLineDash([]);

          diagCtx.fillStyle = '#F3C65F';
          diagCtx.fillText('Média x̄ = 7', w - 55, midY - 8);

          const pts = [
            { x: 50, y: midY + 36, label: '4' },
            { x: 95, y: midY + 14, label: '6' },
            { x: 140, y: midY, label: '7' },
            { x: 185, y: midY, label: '7' },
            { x: 230, y: midY - 44, label: '11' }
          ];
          pts.forEach(p => {
            diagCtx.strokeStyle = '#F29CA3';
            diagCtx.beginPath();
            diagCtx.moveTo(p.x, midY);
            diagCtx.lineTo(p.x, p.y);
            diagCtx.stroke();

            diagCtx.fillStyle = '#7CC6FE';
            diagCtx.beginPath();
            diagCtx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
            diagCtx.fill();

            diagCtx.fillStyle = '#F4F1EA';
            diagCtx.textAlign = 'center';
            diagCtx.fillText(p.label, p.x, p.y - 8);
          });
          return;
        }

        if (type === 'venn') {
          // Diagrama de Venn (Probabilidade)
          diagCtx.strokeRect(24, 16, w - 48, h - 32);
          diagCtx.fillText('Ω', 36, 32);

          diagCtx.strokeStyle = '#7CC6FE';
          diagCtx.beginPath();
          diagCtx.arc(w / 2 - 26, h / 2 + 4, 42, 0, Math.PI * 2);
          diagCtx.stroke();

          diagCtx.strokeStyle = '#F3C65F';
          diagCtx.beginPath();
          diagCtx.arc(w / 2 + 26, h / 2 + 4, 42, 0, Math.PI * 2);
          diagCtx.stroke();

          diagCtx.textAlign = 'center';
          diagCtx.fillStyle = '#7CC6FE';
          diagCtx.fillText('A', w / 2 - 42, h / 2 + 8);
          diagCtx.fillStyle = '#F3C65F';
          diagCtx.fillText('B', w / 2 + 42, h / 2 + 8);
          diagCtx.fillStyle = '#F4F1EA';
          diagCtx.fillText('A∩B', w / 2, h / 2 + 8);
          return;
        }

        if (type === 'parabola') {
          const ox = 60, oy = h - 42;
          diagCtx.beginPath();
          diagCtx.moveTo(20, oy); diagCtx.lineTo(w - 20, oy);
          diagCtx.moveTo(ox, 16); diagCtx.lineTo(ox, h - 14);
          diagCtx.stroke();

          diagCtx.strokeStyle = '#F3C65F';
          diagCtx.lineWidth = 2.5;
          diagCtx.beginPath();
          for (let px = -15; px <= 165; px += 3) {
            const xVal = px / 35 + 0.5;
            const yVal = (xVal - 2) * (xVal - 3);
            const sx = ox + xVal * 42;
            const sy = oy - yVal * 38;
            if (px === -15) diagCtx.moveTo(sx, sy);
            else diagCtx.lineTo(sx, sy);
          }
          diagCtx.stroke();

          diagCtx.fillStyle = '#7CC6FE';
          diagCtx.beginPath();
          diagCtx.arc(ox + 2 * 42, oy, 4, 0, Math.PI * 2);
          diagCtx.arc(ox + 3 * 42, oy, 4, 0, Math.PI * 2);
          diagCtx.fill();
          diagCtx.fillText("x'=2", ox + 2 * 42 - 10, oy + 16);
          diagCtx.fillText("x''=3", ox + 3 * 42 + 6, oy + 16);
          return;
        }

        // Diagrama genérico para Física/História/Biologia
        diagCtx.strokeStyle = '#F3C65F';
        diagCtx.strokeRect(45, 40, w - 90, h - 80);
        diagCtx.textAlign = 'center';
        diagCtx.fillStyle = '#F4F1EA';
        diagCtx.fillText(lectureState.chalkTop, w / 2, h / 2 - 6);
        diagCtx.fillStyle = '#7CC6FE';
        diagCtx.fillText("Esquema Resumo no Quadro", w / 2, h / 2 + 16);
      }

      // Eventos dos Seletores e Botões da Interface
      document.getElementById('subject-select').addEventListener('change', (e) => {
        setSubject(e.target.value, 0);
      });

      document.getElementById('modal-subject-select').addEventListener('change', (e) => {
        setSubject(e.target.value, 0);
      });

      document.querySelectorAll('.sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          setSubject(btn.getAttribute('data-subject'), 0);
        });
      });

      document.getElementById('btn-prev-step').onclick = () => changeStep(-1);
      document.getElementById('btn-next-step').onclick = () => changeStep(1);
      document.getElementById('modal-next-btn').onclick = () => changeStep(1);

      document.getElementById('btn-open-board').onclick = () => openBoardModal();
      document.getElementById('btn-board-toolbar').onclick = () => openBoardModal();
      document.getElementById('btn-close-modal').onclick = () => closeBoardModal();

      document.getElementById('board-modal').addEventListener('click', (e) => {
        if (e.target.id === 'board-modal') closeBoardModal();
      });

      document.getElementById('modal-ask-btn').onclick = () => {
        closeBoardModal();
        askQuestion();
      };

      function askQuestion() {
        const sub = SUBJECTS[lectureState.subjectKey];
        const qa = sub.qa[lectureState.qaIndex % sub.qa.length];
        lectureState.qaIndex++;

        player.handRaised = 3.5;
        player.speech = qa.q;
        player.speechTimer = 3.5;

        setTimeout(() => {
          teacher.writingAtBoard = false;
          teacher.facing = { x: 0, y: 1 };
          teacher.speech = qa.a;
          teacher.speechTimer = 5.8;
          lectureState.stepTimer = 1.5;
        }, 1500);
      }

      function togglePlayerSit(chairObj = player.myChair) {
        if (player.sittingOn) {
          const ch = player.sittingOn;
          player.sittingOn = null;
          player.x = ch.x - 0.52;
          player.y = ch.y + ch.d / 2;
          player.z = 0;
          player.speech = "Levantei para ver o quadro de perto.";
          player.speechTimer = 2.2;
        } else if (chairObj) {
          player.sittingOn = chairObj;
          player.targetPos = null;
          player.isMoving = false;
          player.x = chairObj.x + chairObj.w / 2;
          player.y = chairObj.y + chairObj.d / 2;
          player.z = 0.25;
          player.facing = { ...chairObj.seatDir };
          player.speech = "Sentado assistindo à explicação.";
          player.speechTimer = 2.2;
        }
      }

      // Projeção Isométrica com 4 Rotações
      function rotateGridCoords(gx, gy) {
        switch (camera.rotation) {
          case 0: return { rx: gx, ry: gy };
          case 1: return { rx: GRID_H - gy, ry: gx };
          case 2: return { rx: GRID_W - gx, ry: GRID_H - gy };
          case 3: return { rx: gy, ry: GRID_W - gx };
        }
      }

      function getDepth(gx, gy, gz = 0) {
        const { rx, ry } = rotateGridCoords(gx, gy);
        return rx + ry + gz * 0.01;
      }

      function isoToScreen(gx, gy, gz = 0) {
        const { rx, ry } = rotateGridCoords(gx, gy);
        const sx = camera.offsetX + (rx - ry) * (TILE_W / 2);
        const sy = camera.offsetY + (rx + ry) * (TILE_H / 2) - gz * Z_SCALE;
        return { x: sx, y: sy };
      }

      function screenToIso(sx, sy) {
        const dx = sx - camera.offsetX;
        const dy = sy - camera.offsetY;
        const rx = (dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2;
        const ry = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2;

        switch (camera.rotation) {
          case 0: return { gx: rx, gy: ry };
          case 1: return { gx: ry, gy: GRID_H - rx };
          case 2: return { gx: GRID_W - rx, gy: GRID_H - ry };
          case 3: return { gx: GRID_W - ry, gy: rx };
        }
      }

      function isFaceVisible(worldFace) {
        const visMap = [
          ['E', 'S'],
          ['N', 'E'],
          ['W', 'N'],
          ['S', 'W']
        ];
        return visMap[camera.rotation].includes(worldFace);
      }

      function drawQuad3D(pts3D, fillColor, strokeColor = null, lineWidth = 1) {
        const screenPts = pts3D.map(p => isoToScreen(p[0], p[1], p[2]));
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(screenPts[0].x, screenPts[0].y);
        for (let i = 1; i < screenPts.length; i++) {
          ctx.lineTo(screenPts[i].x, screenPts[i].y);
        }
        ctx.closePath();
        ctx.fill();
        if (strokeColor) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }

      function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const minDim = Math.min(window.innerWidth, window.innerHeight);
        TILE_W = Math.max(46, Math.min(76, minDim * 0.088));
        TILE_H = TILE_W / 2;
        Z_SCALE = TILE_W * 0.64;

        camera.offsetX = window.innerWidth * 0.52;
        camera.offsetY = window.innerHeight * 0.20;
      }

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      // Verifica se um clique de tela atingiu o Quadro-Negro na Parede Norte
      function isPointInPolygon(px, py, pts) {
        let inside = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          const xi = pts[i].x, yi = pts[i].y;
          const xj = pts[j].x, yj = pts[j].y;
          const intersect = ((yi > py) !== (yj > py)) &&
            (px < (xj - xi) * (py - yi) / ((yj - yi) || 1e-6) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
      }

      function getChalkboardScreenPolygon() {
        return [
          isoToScreen(2.2, 0.02, 0.92),
          isoToScreen(8.5, 0.02, 0.92),
          isoToScreen(8.5, 0.02, 2.55),
          isoToScreen(2.2, 0.02, 2.55)
        ];
      }

      const keys = {};
      window.addEventListener('keydown', (e) => {
        const modalOpen = document.getElementById('board-modal').classList.contains('open');
        if (modalOpen) {
          if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
            closeBoardModal();
          } else if (e.key === 'ArrowRight') {
            changeStep(1);
          } else if (e.key === 'ArrowLeft') {
            changeStep(-1);
          }
          return;
        }

        const k = e.key.toLowerCase();
        keys[k] = true;

        if (k === 'b') openBoardModal();
        if (k === 'q') rotateCamera(-1);
        if (k === 'e') rotateCamera(1);
        if (k === 'l') camera.nightMode = !camera.nightMode;
        if (k === 'c') togglePlayerSit();
        if (e.code === 'Space') {
          e.preventDefault();
          askQuestion();
        }
      });

      window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
      });

      canvas.addEventListener('pointerdown', (e) => {
        if (document.getElementById('board-modal').classList.contains('open')) return;

        // 1. Se clicou diretamente no Quadro-Negro na parede norte, abre a modal do quadro!
        if ((camera.rotation === 0 || camera.rotation === 3) &&
            isPointInPolygon(e.clientX, e.clientY, getChalkboardScreenPolygon())) {
          openBoardModal();
          return;
        }

        const { gx, gy } = screenToIso(e.clientX, e.clientY);

        // 2. Se clicou em algum colega sentado
        for (const st of classmates) {
          if (Math.hypot(gx - st.x, gy - st.y) < 0.55) {
            st.speech = st.comment;
            st.speechTimer = 3.5;
            return;
          }
        }

        // 3. Se clicou na sua própria cadeira (#5), senta nela
        if (player.myChair) {
          const cx = player.myChair.x + player.myChair.w / 2;
          const cy = player.myChair.y + player.myChair.d / 2;
          if (Math.hypot(gx - cx, gy - cy) < 0.6 && !player.sittingOn) {
            togglePlayerSit(player.myChair);
            return;
          }
        }

        // 4. Caminhar até o ladrilho clicado
        if (gx >= 0.45 && gx <= GRID_W - 0.45 && gy >= 0.45 && gy <= GRID_H - 0.45) {
          if (player.sittingOn) togglePlayerSit();
          player.targetPos = { x: gx, y: gy };
          floorRipples.push({ x: gx, y: gy, radius: 0.05, alpha: 1.0 });
        }
      });

      function rotateCamera(delta) {
        camera.rotation = (camera.rotation + delta + 4) % 4;
        document.getElementById('cam-dir-label').textContent = ROT_LABELS[camera.rotation];
      }

      document.getElementById('btn-rot-left').onclick = () => rotateCamera(-1);
      document.getElementById('btn-rot-right').onclick = () => rotateCamera(1);
      document.getElementById('btn-hand').onclick = () => askQuestion();
      document.getElementById('btn-sit').onclick = () => togglePlayerSit();
      document.getElementById('btn-light').onclick = () => {
        camera.nightMode = !camera.nightMode;
      };

      function collidesWithProps(nx, ny) {
        const r = player.radius;
        if (nx - r < 0.35 || nx + r > GRID_W - 0.35 || ny - r < 0.35 || ny + r > GRID_H - 0.35) {
          return true;
        }
        for (const p of props) {
          if (!p.solid) continue;
          const closestX = Math.max(p.x, Math.min(nx, p.x + p.w));
          const closestY = Math.max(p.y, Math.min(ny, p.y + p.d));
          const distSq = (nx - closestX) ** 2 + (ny - closestY) ** 2;
          if (distSq < r * r) return true;
        }
        return false;
      }

      function drawIsoPrism(x, y, z, w, d, h, topColor, leftColor, rightColor, strokeColor = 'rgba(20,15,10,0.28)') {
        const corners = [
          { gx: x,     gy: y },
          { gx: x + w, gy: y },
          { gx: x + w, gy: y + d },
          { gx: x,     gy: y + d }
        ];

        const topPts = corners.map(c => isoToScreen(c.gx, c.gy, z + h));
        const botPts = corners.map(c => isoToScreen(c.gx, c.gy, z));

        const worldFaces = [
          { name: 'N', idx: [0, 1] },
          { name: 'E', idx: [1, 2] },
          { name: 'S', idx: [2, 3] },
          { name: 'W', idx: [3, 0] }
        ];

        for (const f of worldFaces) {
          if (!isFaceVisible(f.name)) continue;
          const [i0, i1] = f.idx;
          const centerScreenX = (topPts[i0].x + topPts[i1].x) / 2;
          const boxCenterX = (topPts[0].x + topPts[1].x + topPts[2].x + topPts[3].x) / 4;
          ctx.fillStyle = centerScreenX < boxCenterX ? leftColor : rightColor;

          ctx.beginPath();
          ctx.moveTo(topPts[i0].x, topPts[i0].y);
          ctx.lineTo(topPts[i1].x, topPts[i1].y);
          ctx.lineTo(botPts[i1].x, botPts[i1].y);
          ctx.lineTo(botPts[i0].x, botPts[i0].y);
          ctx.closePath();
          ctx.fill();
          if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(topPts[0].x, topPts[0].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(topPts[i].x, topPts[i].y);
        ctx.closePath();
        ctx.fill();
        if (strokeColor) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      function drawSortedParts(parts) {
        parts.sort((a, b) => {
          const da = getDepth(a.x + a.w / 2, a.y + a.d / 2, a.z + a.h / 2) + (a.bias || 0);
          const db = getDepth(b.x + b.w / 2, b.y + b.d / 2, b.z + b.h / 2) + (b.bias || 0);
          return da - db;
        });
        for (const pt of parts) {
          drawIsoPrism(pt.x, pt.y, pt.z, pt.w, pt.d, pt.h, pt.top, pt.left, pt.right, pt.stroke);
        }
      }

      function drawFloorAndWalls() {
        const f0 = isoToScreen(0, 0, -0.18);
        const f1 = isoToScreen(GRID_W, 0, -0.18);
        const f2 = isoToScreen(GRID_W, GRID_H, -0.18);
        const f3 = isoToScreen(0, GRID_H, -0.18);

        ctx.fillStyle = '#090D0B';
        ctx.beginPath();
        ctx.moveTo(f0.x, f0.y + 18);
        ctx.lineTo(f1.x, f1.y + 18);
        ctx.lineTo(f2.x, f2.y + 18);
        ctx.lineTo(f3.x, f3.y + 18);
        ctx.closePath();
        ctx.fill();

        drawIsoPrism(0, 0, -0.18, GRID_W, GRID_H, 0.18, '#B88450', '#6E4726', '#54351B', null);

        for (let gx = 0; gx < GRID_W; gx++) {
          for (let gy = 0; gy < GRID_H; gy++) {
            const p0 = isoToScreen(gx, gy, 0);
            const p1 = isoToScreen(gx + 1, gy, 0);
            const p2 = isoToScreen(gx + 1, gy + 1, 0);
            const p3 = isoToScreen(gx, gy + 1, 0);

            const isAlt = (gx + gy) % 2 === 0;
            if (camera.nightMode) {
              ctx.fillStyle = isAlt ? '#6D523B' : '#634934';
            } else {
              ctx.fillStyle = isAlt ? '#C9935B' : '#BD8750';
            }

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(72, 42, 18, 0.22)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (!camera.nightMode) {
          const windowsY = [2.6, 5.1];
          for (const wy of windowsY) {
            const s0 = isoToScreen(0.1, wy, 0.01);
            const s1 = isoToScreen(0.1, wy + 1.8, 0.01);
            const s2 = isoToScreen(4.6, wy + 2.7, 0.01);
            const s3 = isoToScreen(4.6, wy + 0.9, 0.01);

            const grad = ctx.createLinearGradient(s0.x, s0.y, s2.x, s2.y);
            grad.addColorStop(0, 'rgba(255, 232, 158, 0.34)');
            grad.addColorStop(1, 'rgba(255, 232, 158, 0.0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(s0.x, s0.y);
            ctx.lineTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineTo(s3.x, s3.y);
            ctx.closePath();
            ctx.fill();
          }
        }

        for (let i = floorRipples.length - 1; i >= 0; i--) {
          const rp = floorRipples[i];
          const center = isoToScreen(rp.x, rp.y, 0.02);
          ctx.save();
          ctx.strokeStyle = `rgba(243, 198, 95, ${rp.alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(center.x, center.y, rp.radius * TILE_W * 0.5, rp.radius * TILE_H * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        drawBackWalls();
      }

      function drawBackWalls() {
        const wallH = 3.15;
        const wallColorA = camera.nightMode ? '#878E88' : '#E8E2D5';
        const wallColorB = camera.nightMode ? '#747B75' : '#D8D0C1';
        const wainscotA = camera.nightMode ? '#3E5246' : '#5F7A69';
        const wainscotB = camera.nightMode ? '#33453A' : '#4E6657';

        if (camera.rotation === 0 || camera.rotation === 3) {
          drawWallSegment(0, 0, GRID_W, 0, wallH, wallColorA, wainscotA);
          drawNorthWallDetails();
        }
        if (camera.rotation === 0 || camera.rotation === 1) {
          drawWallSegment(0, 0, 0, GRID_H, wallH, wallColorB, wainscotB);
          drawWestWallDetails();
        }
        if (camera.rotation === 1 || camera.rotation === 2) {
          drawWallSegment(0, GRID_H, GRID_W, GRID_H, wallH, wallColorA, wainscotA);
        }
        if (camera.rotation === 2 || camera.rotation === 3) {
          drawWallSegment(GRID_W, 0, GRID_W, GRID_H, wallH, wallColorB, wainscotB);
        }
      }

      function drawWallSegment(x0, y0, x1, y1, h, topFill, lowerFill) {
        const b0 = isoToScreen(x0, y0, 0);
        const b1 = isoToScreen(x1, y1, 0);
        const m0 = isoToScreen(x0, y0, 1.05);
        const m1 = isoToScreen(x1, y1, 1.05);
        const t0 = isoToScreen(x0, y0, h);
        const t1 = isoToScreen(x1, y1, h);

        ctx.fillStyle = topFill;
        ctx.beginPath();
        ctx.moveTo(m0.x, m0.y);
        ctx.lineTo(m1.x, m1.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t0.x, t0.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.stroke();

        ctx.fillStyle = lowerFill;
        ctx.beginPath();
        ctx.moveTo(b0.x, b0.y);
        ctx.lineTo(b1.x, b1.y);
        ctx.lineTo(m1.x, m1.y);
        ctx.lineTo(m0.x, m0.y);
        ctx.closePath();
        ctx.fill();
      }

      function drawNorthWallDetails() {
        const b0 = isoToScreen(2.2, 0.02, 0.92);
        const b1 = isoToScreen(8.5, 0.02, 0.92);
        const t1 = isoToScreen(8.5, 0.02, 2.55);
        const t0 = isoToScreen(2.2, 0.02, 2.55);

        ctx.fillStyle = '#1B382B';
        ctx.strokeStyle = '#6E4726';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(b0.x, b0.y);
        ctx.lineTo(b1.x, b1.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t0.x, t0.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const centerChalk = isoToScreen(5.35, 0.04, 1.78);
        ctx.save();
        ctx.translate(centerChalk.x, centerChalk.y);
        const angle = Math.atan2(b1.y - b0.y, b1.x - b0.x);
        ctx.rotate(angle);

        ctx.fillStyle = 'rgba(243, 198, 95, 0.95)';
        ctx.font = `700 ${Math.round(TILE_W * 0.14)}px "Architects Daughter", cursive`;
        ctx.textAlign = 'center';
        ctx.fillText(lectureState.chalkTop, 0, -TILE_W * 0.28);

        ctx.fillStyle = 'rgba(244, 241, 234, 0.96)';
        ctx.font = `${Math.round(TILE_W * 0.165)}px "Architects Daughter", cursive`;
        ctx.fillText(lectureState.chalkMain, 0, -TILE_W * 0.02);

        ctx.fillStyle = 'rgba(124, 198, 254, 0.85)';
        ctx.font = `${Math.round(TILE_W * 0.125)}px "IBM Plex Mono", monospace`;
        ctx.fillText("🔍 Clique no quadro ou aperte [B] para ampliar", 0, TILE_W * 0.24);
        ctx.restore();

        // Relógio de Parede
        const clk = isoToScreen(5.35, 0.03, 2.86);
        ctx.fillStyle = '#FBF8F1';
        ctx.strokeStyle = '#3A2615';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(clk.x, clk.y, TILE_W * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(clk.x, clk.y);
        ctx.lineTo(clk.x + 4, clk.y + 5);
        ctx.moveTo(clk.x, clk.y);
        ctx.lineTo(clk.x + 6, clk.y - 2);
        ctx.stroke();
      }

      function drawWestWallDetails() {
        const winRanges = [[2.6, 4.4], [5.1, 6.9]];
        for (const [wy0, wy1] of winRanges) {
          const w0 = isoToScreen(0.02, wy0, 1.15);
          const w1 = isoToScreen(0.02, wy1, 1.15);
          const w2 = isoToScreen(0.02, wy1, 2.65);
          const w3 = isoToScreen(0.02, wy0, 2.65);

          ctx.fillStyle = camera.nightMode ? '#1A2639' : '#FCE39D';
          ctx.beginPath();
          ctx.moveTo(w0.x, w0.y); ctx.lineTo(w1.x, w1.y);
          ctx.lineTo(w2.x, w2.y); ctx.lineTo(w3.x, w3.y);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#4A3520';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        const d0 = isoToScreen(0.02, 7.7, 0);
        const d1 = isoToScreen(0.02, 9.05, 0);
        const d2 = isoToScreen(0.02, 9.05, 2.35);
        const d3 = isoToScreen(0.02, 7.7, 2.35);

        ctx.fillStyle = '#7A4924';
        ctx.beginPath();
        ctx.moveTo(d0.x, d0.y); ctx.lineTo(d1.x, d1.y);
        ctx.lineTo(d2.x, d2.y); ctx.lineTo(d3.x, d3.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3E2411';
        ctx.lineWidth = 3;
        ctx.stroke();

        const v0 = isoToScreen(0.03, 8.05, 1.45);
        const v1 = isoToScreen(0.03, 8.7, 1.45);
        const v2 = isoToScreen(0.03, 8.7, 2.05);
        const v3 = isoToScreen(0.03, 8.05, 2.05);
        ctx.fillStyle = '#A8D0E6';
        ctx.beginPath();
        ctx.moveTo(v0.x, v0.y); ctx.lineTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y); ctx.lineTo(v3.x, v3.y);
        ctx.closePath();
        ctx.fill();
      }

      function drawProp(p) {
        if (p.type === 'platform') {
          drawIsoPrism(p.x, p.y, 0, p.w, p.d, p.h, '#9E6B3B', '#754D28', '#5E3D1E');
          return;
        }

        if (p.type === 'student_desk') {
          drawQuad3D([
            [p.x + 0.04, p.y + 0.04, 0.01],
            [p.x + p.w - 0.04, p.y + 0.04, 0.01],
            [p.x + p.w - 0.04, p.y + p.d - 0.04, 0.01],
            [p.x + 0.04, p.y + p.d - 0.04, 0.01]
          ], 'rgba(0,0,0,0.18)');

          const legW = 0.09;
          const legH = p.h - 0.09;
          const isPlayerDesk = (p.deskNumber === 5);
          const topC = isPlayerDesk ? '#E4A863' : '#D99B58';

          const deskParts = [
            { x: p.x + 0.05, y: p.y + 0.05, z: 0, w: legW, d: legW, h: legH, top: '#495850', left: '#34403A', right: '#222A26', stroke: null },
            { x: p.x + p.w - 0.14, y: p.y + 0.05, z: 0, w: legW, d: legW, h: legH, top: '#495850', left: '#34403A', right: '#222A26', stroke: null },
            { x: p.x + 0.05, y: p.y + p.d - 0.14, z: 0, w: legW, d: legW, h: legH, top: '#495850', left: '#34403A', right: '#222A26', stroke: null },
            { x: p.x + p.w - 0.14, y: p.y + p.d - 0.14, z: 0, w: legW, d: legW, h: legH, top: '#495850', left: '#34403A', right: '#222A26', stroke: null },
            { x: p.x + 0.09, y: p.y + 0.09, z: p.h - 0.23, w: p.w - 0.18, d: p.d - 0.18, h: 0.13, top: '#7E512B', left: '#684222', right: '#52341A', stroke: null, bias: 0.05 },
            { x: p.x, y: p.y, z: p.h - 0.09, w: p.w, d: p.d, h: 0.09, top: topC, left: '#A87139', right: '#8C5C2C', stroke: 'rgba(20,15,10,0.32)', bias: 0.25 }
          ];

          drawSortedParts(deskParts);

          if (p.hasOpenBook) {
            drawIsoPrism(p.x + 0.24, p.y + 0.18, p.h, 0.44, 0.32, 0.035, '#FBF8F1', '#D8D2C5', '#C2BCAE');
          }

          if (p.hasPencilCase) {
            drawIsoPrism(p.x + 0.74, p.y + 0.22, p.h, 0.28, 0.15, 0.07, '#2B72B8', '#1D5287', '#153C63');
          }
          return;
        }

        if (p.type === 'chair') {
          drawQuad3D([
            [p.x + 0.04, p.y + 0.04, 0.01],
            [p.x + p.w - 0.04, p.y + 0.04, 0.01],
            [p.x + p.w - 0.04, p.y + p.d - 0.04, 0.01],
            [p.x + 0.04, p.y + p.d - 0.04, 0.01]
          ], 'rgba(0,0,0,0.20)');

          const seatH = 0.43;
          const legW = 0.085;
          const legTop = '#4E5B53';
          const legL = '#37423B';
          const legR = '#252D28';

          const seatTop = p.isTeacherChair ? '#8C3B32' : '#B5763D';
          const seatL = p.isTeacherChair ? '#6E2B24' : '#8A572A';
          const seatR = p.isTeacherChair ? '#521E19' : '#6B421E';

          const backY = p.isTeacherChair ? p.y + 0.02 : p.y + p.d - 0.11;

          const chairParts = [
            { x: p.x + 0.03, y: p.y + 0.03, z: 0, w: legW, d: legW, h: seatH - 0.07, top: legTop, left: legL, right: legR, stroke: null },
            { x: p.x + p.w - 0.03 - legW, y: p.y + 0.03, z: 0, w: legW, d: legW, h: seatH - 0.07, top: legTop, left: legL, right: legR, stroke: null },
            { x: p.x + 0.03, y: p.y + p.d - 0.03 - legW, z: 0, w: legW, d: legW, h: seatH - 0.07, top: legTop, left: legL, right: legR, stroke: null },
            { x: p.x + p.w - 0.03 - legW, y: p.y + p.d - 0.03 - legW, z: 0, w: legW, d: legW, h: seatH - 0.07, top: legTop, left: legL, right: legR, stroke: null },
            { x: p.x, y: p.y, z: seatH - 0.07, w: p.w, d: p.d, h: 0.08, top: seatTop, left: seatL, right: seatR, stroke: 'rgba(20,15,10,0.3)', bias: 0.12 },
            { x: p.x + 0.05, y: backY, z: seatH + 0.01, w: 0.07, d: 0.07, h: 0.22, top: legTop, left: legL, right: legR, stroke: null, bias: 0.16 },
            { x: p.x + p.w - 0.12, y: backY, z: seatH + 0.01, w: 0.07, d: 0.07, h: 0.22, top: legTop, left: legL, right: legR, stroke: null, bias: 0.16 },
            { x: p.x + 0.01, y: backY, z: seatH + 0.16, w: p.w - 0.02, d: 0.09, h: 0.21, top: seatTop, left: seatL, right: seatR, stroke: 'rgba(20,15,10,0.3)', bias: 0.22 }
          ];

          drawSortedParts(chairParts);
          return;
        }

        if (p.type === 'teacher_desk') {
          const baseZ = 0.14;
          const tParts = [
            { x: p.x + 0.06, y: p.y + 0.06, z: baseZ, w: 0.48, d: p.d - 0.12, h: p.h - 0.1, top: '#7A4B24', left: '#633C1C', right: '#4D2E15', stroke: 'rgba(20,15,10,0.28)' },
            { x: p.x + p.w - 0.54, y: p.y + 0.06, z: baseZ, w: 0.48, d: p.d - 0.12, h: p.h - 0.1, top: '#7A4B24', left: '#633C1C', right: '#4D2E15', stroke: 'rgba(20,15,10,0.28)' },
            { x: p.x, y: p.y, z: baseZ + p.h - 0.1, w: p.w, d: p.d, h: 0.1, top: '#A66A38', left: '#805027', right: '#663E1E', stroke: 'rgba(20,15,10,0.32)', bias: 0.2 }
          ];
          drawSortedParts(tParts);

          drawIsoPrism(p.x + 0.25, p.y + 0.22, baseZ + p.h, 0.44, 0.34, 0.07, '#284B63', '#1D3647', '#152836');

          const globePos = isoToScreen(p.x + 1.48, p.y + 0.42, baseZ + p.h + 0.24);
          ctx.fillStyle = '#3B8EA5';
          ctx.beginPath();
          ctx.arc(globePos.x, globePos.y, TILE_W * 0.13, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#D9AE61';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          return;
        }

        if (p.type === 'trash_bin') {
          drawIsoPrism(p.x, p.y, 0, p.w, p.d, p.h, '#526760', '#3D4D47', '#2D3A36');
          drawIsoPrism(p.x + 0.08, p.y + 0.08, p.h - 0.02, p.w - 0.16, p.d - 0.16, 0.03, '#1A2421', '#1A2421', '#1A2421', null);
          return;
        }

        if (p.type === 'bookshelf') {
          drawIsoPrism(p.x, p.y, 0, p.w, p.d, p.h, '#8C582C', '#6B421F', '#523217');
          if (isFaceVisible('E')) {
            const fx = p.x + p.w + 0.005;
            const shelvesZ = [0.18, 0.72, 1.26];
            const bookPalette = ['#C84B31', '#2B72B8', '#D9AE61', '#3E7A56', '#7A3E65', '#D47A27'];

            shelvesZ.forEach((sz, sIdx) => {
              drawQuad3D([
                [fx, p.y + 0.12, sz],
                [fx, p.y + p.d - 0.12, sz],
                [fx, p.y + p.d - 0.12, sz + 0.44],
                [fx, p.y + 0.12, sz + 0.44]
              ], '#2B1A0C', '#4A2E16', 1);

              let cursorY = p.y + 0.16;
              let bCount = 0;
              while (cursorY < p.y + p.d - 0.28) {
                const bw = 0.16 + ((sIdx + bCount) % 3) * 0.04;
                const bh = 0.32 + ((sIdx * 2 + bCount) % 2) * 0.06;
                const color = bookPalette[(sIdx * 3 + bCount) % bookPalette.length];
                drawQuad3D([
                  [fx + 0.004, cursorY, sz + 0.02],
                  [fx + 0.004, cursorY + bw, sz + 0.02],
                  [fx + 0.004, cursorY + bw, sz + 0.02 + bh],
                  [fx + 0.004, cursorY, sz + 0.02 + bh]
                ], color, 'rgba(0,0,0,0.35)', 1);
                cursorY += bw + 0.03;
                bCount++;
              }
            });
          }
          return;
        }

        if (p.type === 'lockers') {
          drawIsoPrism(p.x, p.y, 0, p.w, p.d, p.h, '#6A8391', '#556B78', '#40525C');
          if (isFaceVisible('S')) {
            const fy = p.y + p.d + 0.006;
            const numDoors = 3;
            const margin = 0.10;
            const doorW = (p.w - margin * (numDoors + 1)) / numDoors;

            for (let i = 0; i < numDoors; i++) {
              const dx0 = p.x + margin + i * (doorW + margin);
              const dx1 = dx0 + doorW;

              drawQuad3D([
                [dx0, fy, 0.14],
                [dx1, fy, 0.14],
                [dx1, fy, p.h - 0.12],
                [dx0, fy, p.h - 0.12]
              ], '#7D98A6', '#2E3D45', 1.5);

              for (let v = 0; v < 3; v++) {
                const vz = p.h - 0.28 - v * 0.09;
                drawQuad3D([
                  [dx0 + 0.12, fy + 0.003, vz],
                  [dx1 - 0.12, fy + 0.003, vz],
                  [dx1 - 0.12, fy + 0.003, vz + 0.04],
                  [dx0 + 0.12, fy + 0.003, vz + 0.04]
                ], '#2E3D45');
              }

              drawQuad3D([
                [dx0 + 0.22, fy + 0.003, p.h - 0.65],
                [dx1 - 0.22, fy + 0.003, p.h - 0.65],
                [dx1 - 0.22, fy + 0.003, p.h - 0.53],
                [dx0 + 0.22, fy + 0.003, p.h - 0.53]
              ], '#E6E1D6', '#2E3D45', 1);
            }
          }
          return;
        }
      }

      function drawStudentCharacter({ x, y, z, skin, hair, bagColor, isSitting, isMoving, walkCycle, facing, handRaised, isPlayer, phase = 0 }) {
        const shadowPos = isoToScreen(x, y, 0.02);
        if (!isSitting) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
          ctx.beginPath();
          ctx.ellipse(shadowPos.x, shadowPos.y, TILE_W * 0.19, TILE_H * 0.19, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        const bob = isMoving ? Math.abs(Math.sin(walkCycle * 10)) * 0.08 : 0;
        const pos = isoToScreen(x, y, z + bob);

        ctx.lineWidth = Math.max(4, TILE_W * 0.075);
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1E3557';

        if (isSitting) {
          ctx.beginPath();
          ctx.moveTo(pos.x - 5, pos.y - 8);
          ctx.lineTo(pos.x - 7, pos.y + 4);
          ctx.moveTo(pos.x + 5, pos.y - 8);
          ctx.lineTo(pos.x + 3, pos.y + 4);
          ctx.stroke();
        } else {
          const legSwing = isMoving ? Math.sin(walkCycle * 10) * 5 : 0;
          ctx.beginPath();
          ctx.moveTo(pos.x - 5, pos.y - 12);
          ctx.lineTo(pos.x - 5 - legSwing, pos.y);
          ctx.moveTo(pos.x + 5, pos.y - 12);
          ctx.lineTo(pos.x + 5 + legSwing, pos.y);
          ctx.stroke();
        }

        const dirScreenX = (facing.x - facing.y);
        const backpackOffsetX = dirScreenX >= 0 ? -7 : 7;
        ctx.fillStyle = bagColor || '#D64045';
        ctx.strokeStyle = '#221814';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(pos.x + backpackOffsetX - 5.5, pos.y - 30, 11, 15, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#F4F1EA';
        ctx.beginPath();
        ctx.roundRect(pos.x - 8.5, pos.y - 32, 17, 20, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isPlayer ? '#F3C65F' : '#183026';
        ctx.fillRect(pos.x - 8.5, pos.y - 32, 17, 5);

        if (handRaised > 0) {
          ctx.strokeStyle = skin;
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(pos.x + 7, pos.y - 26);
          ctx.lineTo(pos.x + 11, pos.y - 52);
          ctx.stroke();
        } else if (isSitting) {
          const writeMove = Math.sin(performance.now() * 0.008 + phase) * 2.2;
          ctx.strokeStyle = skin;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(pos.x + 6, pos.y - 24);
          ctx.lineTo(pos.x + 2 + writeMove, pos.y - 18);
          ctx.stroke();
        }

        const headBob = isSitting ? Math.sin(performance.now() * 0.003 + phase) * 1.2 : 0;
        ctx.fillStyle = skin;
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = '#221814';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 42 + headBob, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = hair;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 44.5 + headBob, 10.3, Math.PI * 0.95, Math.PI * 2.05);
        ctx.fill();

        if (isPlayer) {
          ctx.fillStyle = '#F3C65F';
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y - 58);
          ctx.lineTo(pos.x - 5, pos.y - 65);
          ctx.lineTo(pos.x + 5, pos.y - 65);
          ctx.closePath();
          ctx.fill();
        }
      }

      function drawTeacher() {
        const shadowPos = isoToScreen(teacher.x, teacher.y, teacher.z + 0.01);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(shadowPos.x, shadowPos.y, TILE_W * 0.21, TILE_H * 0.21, 0, 0, Math.PI * 2);
        ctx.fill();

        const bob = teacher.isMoving ? Math.abs(Math.sin(teacher.walkCycle * 8)) * 0.07 : 0;
        const pos = isoToScreen(teacher.x, teacher.y, teacher.z + bob);

        const legSwing = teacher.isMoving ? Math.sin(teacher.walkCycle * 8) * 4.5 : 0;
        ctx.lineWidth = Math.max(4.5, TILE_W * 0.08);
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#3B2F2F';
        ctx.beginPath();
        ctx.moveTo(pos.x - 5, pos.y - 14);
        ctx.lineTo(pos.x - 5 - legSwing, pos.y);
        ctx.moveTo(pos.x + 5, pos.y - 14);
        ctx.lineTo(pos.x + 5 + legSwing, pos.y);
        ctx.stroke();

        ctx.fillStyle = '#D8CFC2';
        ctx.strokeStyle = '#221814';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(pos.x - 10, pos.y - 37, 20, 24, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#8C2D27';
        ctx.fillRect(pos.x - 2, pos.y - 34, 4, 13);

        const gesture = Math.sin(performance.now() * 0.007) * 5;
        ctx.strokeStyle = '#D8CFC2';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(pos.x + 8, pos.y - 28);
        ctx.lineTo(pos.x + 16, pos.y - 36 + gesture);
        ctx.stroke();

        ctx.strokeStyle = '#F3C65F';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(pos.x + 16, pos.y - 36 + gesture);
        ctx.lineTo(pos.x + 25, pos.y - 48 + gesture);
        ctx.stroke();

        ctx.fillStyle = '#E8B896';
        ctx.strokeStyle = '#221814';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 47, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#5C6468';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 50, 11.2, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#1B2428';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pos.x - 6, pos.y - 48, 5, 3.5);
        ctx.strokeRect(pos.x + 1, pos.y - 48, 5, 3.5);
      }

      function drawBubbleAt(gx, gy, gz, text, isTeacherBubble = false) {
        if (!text) return;
        const headPos = isoToScreen(gx, gy, gz);

        ctx.save();
        ctx.font = isTeacherBubble
          ? '600 13.5px "Space Grotesk", sans-serif'
          : '600 12.5px "Space Grotesk", sans-serif';

        const maxWidth = isTeacherBubble ? 305 : 220;
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const test = currentLine + ' ' + words[i];
          if (ctx.measureText(test).width < maxWidth) {
            currentLine = test;
          } else {
            lines.push(currentLine);
            currentLine = words[i];
          }
        }
        lines.push(currentLine);

        const textW = Math.max(...lines.map(l => ctx.measureText(l).width));
        const boxW = Math.min(maxWidth + 24, textW + 22);
        const boxH = lines.length * 18 + (isTeacherBubble ? 30 : 14);
        const bx = Math.max(16, Math.min(window.innerWidth - boxW - 16, headPos.x - boxW / 2));
        const by = Math.max(16, headPos.y - boxH - 12);

        ctx.fillStyle = isTeacherBubble ? '#FBF8F1' : '#FFFDF9';
        ctx.strokeStyle = isTeacherBubble ? '#183026' : '#1B365D';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 8);
        ctx.fill();
        ctx.stroke();

        let startY = by + 18;
        if (isTeacherBubble) {
          ctx.fillStyle = '#C83E3B';
          ctx.font = '700 11px "IBM Plex Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText("PROF. MOTTA EXPLICA:", bx + 11, by + 15);
          startY = by + 32;
          ctx.font = '600 13.5px "Space Grotesk", sans-serif';
        }

        ctx.fillStyle = '#182A3A';
        ctx.textAlign = 'center';
        lines.forEach((line, i) => {
          ctx.fillText(line, bx + boxW / 2, startY + i * 18);
        });
        ctx.restore();
      }

      let lastTime = performance.now();

      function update(dt) {
        lectureState.stepTimer += dt;
        if (lectureState.stepTimer >= lectureState.stepDuration) {
          lectureState.stepTimer = 0;
          const sub = SUBJECTS[lectureState.subjectKey];
          lectureState.stepIndex = (lectureState.stepIndex + 1) % sub.steps.length;
          applyLectureStep();
          if (document.getElementById('board-modal').classList.contains('open')) {
            syncBoardModalUI();
          }
        }

        const tdx = teacher.targetX - teacher.x;
        const tdy = teacher.targetY - teacher.y;
        const tDist = Math.hypot(tdx, tdy);
        if (tDist > 0.08) {
          teacher.isMoving = true;
          teacher.walkCycle += dt;
          teacher.x += (tdx / tDist) * 1.65 * dt;
          teacher.y += (tdy / tDist) * 1.65 * dt;
          teacher.facing = { x: tdx / tDist, y: tdy / tDist };
        } else {
          teacher.isMoving = false;
          teacher.facing = teacher.writingAtBoard ? { x: 0, y: -1 } : { x: 0, y: 1 };
        }

        if (teacher.speechTimer > 0) teacher.speechTimer -= dt;
        if (player.speechTimer > 0) player.speechTimer -= dt;
        if (player.handRaised > 0) player.handRaised -= dt;

        for (const st of classmates) {
          if (st.speechTimer > 0) st.speechTimer -= dt;
          if (st.handRaisedTimer > 0) st.handRaisedTimer -= dt;
        }

        for (let i = floorRipples.length - 1; i >= 0; i--) {
          floorRipples[i].radius += dt * 1.4;
          floorRipples[i].alpha -= dt * 1.6;
          if (floorRipples[i].alpha <= 0) floorRipples.splice(i, 1);
        }

        let inputScreenX = 0;
        let inputScreenY = 0;
        if (keys['w'] || keys['arrowup']) inputScreenY -= 1;
        if (keys['s'] || keys['arrowdown']) inputScreenY += 1;
        if (keys['a'] || keys['arrowleft']) inputScreenX -= 1;
        if (keys['d'] || keys['arrowright']) inputScreenX += 1;

        if (inputScreenX !== 0 || inputScreenY !== 0) {
          if (player.sittingOn) togglePlayerSit();
          player.targetPos = null;

          let rvx = inputScreenX + inputScreenY;
          let rvy = inputScreenY - inputScreenX;
          const len = Math.hypot(rvx, rvy) || 1;
          rvx /= len;
          rvy /= len;

          let gvx = rvx, gvy = rvy;
          if (camera.rotation === 1) { gvx = rvy; gvy = -rvx; }
          else if (camera.rotation === 2) { gvx = -rvx; gvy = -rvy; }
          else if (camera.rotation === 3) { gvx = -rvy; gvy = rvx; }

          movePlayer(gvx, gvy, dt);
        } else if (player.targetPos && !player.sittingOn) {
          const dx = player.targetPos.x - player.x;
          const dy = player.targetPos.y - player.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 0.12) {
            player.targetPos = null;
            player.isMoving = false;
          } else {
            movePlayer(dx / dist, dy / dist, dt);
          }
        } else {
          player.isMoving = false;
        }

        for (const pt of dustParticles) {
          pt.x = (pt.x + pt.vx * dt + GRID_W) % GRID_W;
          pt.y = (pt.y + pt.vy * dt + GRID_H) % GRID_H;
          pt.phase += dt * 2;
        }
      }

      function movePlayer(dirX, dirY, dt) {
        player.facing = { x: dirX, y: dirY };
        player.isMoving = true;
        player.walkCycle += dt;

        const stepX = dirX * player.speed * dt;
        const stepY = dirY * player.speed * dt;

        if (!collidesWithProps(player.x + stepX, player.y)) {
          player.x += stepX;
        }
        if (!collidesWithProps(player.x, player.y + stepY)) {
          player.y += stepY;
        } else if (player.targetPos) {
          player.targetPos = null;
        }
      }

      function render() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const bgGrad = ctx.createRadialGradient(
          window.innerWidth * 0.5, window.innerHeight * 0.45, 80,
          window.innerWidth * 0.5, window.innerHeight * 0.5, window.innerWidth * 0.75
        );
        if (camera.nightMode) {
          bgGrad.addColorStop(0, '#16202A');
          bgGrad.addColorStop(1, '#090D12');
        } else {
          bgGrad.addColorStop(0, '#27382F');
          bgGrad.addColorStop(1, '#111814');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        drawFloorAndWalls();

        const renderList = [];

        for (const p of props) {
          if (p.type === 'platform') {
            drawProp(p);
            continue;
          }
          const center = rotateGridCoords(p.x + p.w / 2, p.y + p.d / 2);
          renderList.push({
            depth: center.rx + center.ry,
            draw: () => drawProp(p)
          });
        }

        for (const st of classmates) {
          const stRot = rotateGridCoords(st.x, st.y);
          renderList.push({
            depth: stRot.rx + stRot.ry + 0.08,
            draw: () => drawStudentCharacter({
              x: st.x,
              y: st.y,
              z: st.z,
              skin: st.skin,
              hair: st.hair,
              bagColor: st.bag,
              isSitting: true,
              isMoving: false,
              walkCycle: 0,
              facing: { x: 0, y: -1 },
              handRaised: st.handRaisedTimer,
              isPlayer: false,
              phase: st.phase
            })
          });
        }

        const tRot = rotateGridCoords(teacher.x, teacher.y);
        renderList.push({
          depth: tRot.rx + tRot.ry + 0.05,
          draw: () => drawTeacher()
        });

        const pRot = rotateGridCoords(player.x, player.y);
        renderList.push({
          depth: pRot.rx + pRot.ry + (player.sittingOn ? 0.08 : 0),
          draw: () => drawStudentCharacter({
            x: player.x,
            y: player.y,
            z: player.z,
            skin: '#F2C19E',
            hair: '#2B2118',
            bagColor: '#D64045',
            isSitting: Boolean(player.sittingOn),
            isMoving: player.isMoving,
            walkCycle: player.walkCycle,
            facing: player.facing,
            handRaised: player.handRaised,
            isPlayer: true,
            phase: 0
          })
        });

        renderList.sort((a, b) => a.depth - b.depth);
        for (const item of renderList) {
          item.draw();
        }

        for (const pt of dustParticles) {
          const sc = isoToScreen(pt.x, pt.y, pt.z);
          const alpha = 0.25 + 0.25 * Math.sin(pt.phase);
          ctx.fillStyle = camera.nightMode
            ? `rgba(180, 220, 255, ${alpha * 0.6})`
            : `rgba(255, 240, 185, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sc.x, sc.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }

        if (teacher.speechTimer > 0) {
          drawBubbleAt(teacher.x, teacher.y, teacher.z + 1.52, teacher.speech, true);
        }
        if (player.speechTimer > 0) {
          drawBubbleAt(player.x, player.y, player.z + 1.38, player.speech, false);
        }
        for (const st of classmates) {
          if (st.speechTimer > 0) {
            drawBubbleAt(st.x, st.y, st.z + 1.35, `${st.name}: "${st.speech}"`, false);
          }
        }
      }

      function loop(now) {
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        update(dt);
        render();
        requestAnimationFrame(loop);
      }

      requestAnimationFrame(loop);
    })();
  