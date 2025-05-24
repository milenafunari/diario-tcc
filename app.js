// ...código igual ao seu para selectHumor, addMedicamento, atualizarMedList etc...

function showForm() {
  document.getElementById("main-view").style.display = "none";
  document.getElementById("form-view").style.display = "block";
  resetarForm();
}

function voltar() {
  document.getElementById("form-view").style.display = "none";
  document.getElementById("main-view").style.display = "block";
  carregarHistorico();
  renderHumorChart();
}

function salvarRegistro() {
  const data = document.getElementById("data-registro").value;
  const horasSono = document.getElementById("horas-sono").value;
  const horaDormir = document.getElementById("hora-dormir").value;
  const horaAcordar = document.getElementById("hora-acordar").value;
  const qualidadeSono = document.getElementById("qualidade-sono").value;
  const dif = [
    document.getElementById("dif-pegar").checked ? "Pegar no sono" : null,
    document.getElementById("dif-manter").checked ? "Manter o sono" : null,
    document.getElementById("dif-sair").checked ? "Sair da cama" : null
  ].filter(Boolean);
  const humorDesc = document.getElementById("humor-desc").value;
  if (!horasSono || !horaDormir || !horaAcordar || !qualidadeSono) {
    alert("Preencha todas as informações de Sono!");
    return;
  }
  if (medicamentos.length === 0) {
    alert("Adicione pelo menos um medicamento.");
    return;
  }
  if (humorSelecionados.length === 0) {
    alert("Escolha pelo menos um humor.");
    return;
  }
  const sinais = [
    document.getElementById("alerta-sono").checked ? "Sono diminuído" : null,
    document.getElementById("alerta-pensamentos").checked ? "Pensamentos acelerados" : null,
    document.getElementById("alerta-gastos").checked ? "Gastos impulsivos" : null,
    document.getElementById("alerta-irritabilidade").checked ? "Irritabilidade fora do comum" : null,
    document.getElementById("alerta-interesse").checked ? "Perda de interesse" : null,
    document.getElementById("alerta-fora").checked ? "Sensação de estar fora do ar" : null,
    document.getElementById("alerta-vontade").checked ? "Vontade de sumir/desistir" : null,
  ].filter(Boolean);
  const autocuidado = [
    document.getElementById("auto-horario").checked ? "Dormi/acordei no horário" : null,
    document.getElementById("auto-sol").checked ? "Tomei sol/saí de casa" : null,
    document.getElementById("auto-comi").checked ? "Comi em horários razoáveis" : null,
    document.getElementById("auto-agua").checked ? "Bebi água suficiente" : null,
    document.getElementById("auto-rede").checked ? "Evitei redes sociais em excesso" : null,
    document.getElementById("auto-mexi").checked ? "Mexi o corpo" : null,
    document.getElementById("auto-prazer").checked ? "Fiz algo prazeroso" : null,
    document.getElementById("auto-amigo").checked ? "Falei com alguém querido" : null,
  ].filter(Boolean);
  const reflexao = document.getElementById("reflexao").value;
  const gatilho = document.getElementById("gatilho").value;
  const reacao = document.getElementById("reacao").value;

  let historico = JSON.parse(localStorage.getItem("historicoEstabilidade") || "[]");
  historico.unshift({
    data,
    sono: { horasSono, horaDormir, horaAcordar, qualidadeSono, dif },
    medicamentos: JSON.parse(JSON.stringify(medicamentos)),
    humor: { humorSelecionados, humorDesc },
    sinais,
    autocuidado,
    reflexao,
    gatilho,
    reacao
  });
  localStorage.setItem("historicoEstabilidade", JSON.stringify(historico));
  alert("Registro salvo com sucesso! 🙌");
  voltar();
}

function resetarForm() {
  // data do registro como hoje por padrão
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const dd = String(hoje.getDate()).padStart(2, '0');
  document.getElementById("data-registro").value = `${yyyy}-${mm}-${dd}`;
  document.getElementById("horas-sono").value = "";
  document.getElementById("hora-dormir").value = "";
  document.getElementById("hora-acordar").value = "";
  document.getElementById("qualidade-sono").selectedIndex = 0;
  document.getElementById("dif-pegar").checked = false;
  document.getElementById("dif-manter").checked = false;
  document.getElementById("dif-sair").checked = false;
  medicamentos = [];
  atualizarMedList();
  document.querySelectorAll(".emoji-option").forEach(e => e.classList.remove("selected"));
  humorSelecionados = [];
  document.getElementById("humor-desc").value = "";
  [
    "alerta-sono", "alerta-pensamentos", "alerta-gastos", "alerta-irritabilidade", "alerta-interesse", "alerta-fora", "alerta-vontade",
    "auto-horario", "auto-sol", "auto-comi", "auto-agua", "auto-rede", "auto-mexi", "auto-prazer", "auto-amigo"
  ].forEach(id => document.getElementById(id).checked = false);
  document.getElementById("reflexao").value = "";
  document.getElementById("gatilho").value = "";
  document.getElementById("reacao").value = "";
}

function carregarHistorico() {
  const histDiv = document.getElementById("history");
  let historico = JSON.parse(localStorage.getItem("historicoEstabilidade") || "[]");
  histDiv.innerHTML = "";
  if (historico.length === 0) {
    histDiv.innerHTML = "<div class='history-card'>Nenhum registro ainda.</div>";
    return;
  }
  historico.forEach(reg => {
    let medStr = reg.medicamentos.map(m => `${m.nome} (${m.dose}${m.obs ? ", " + m.obs : ""})`).join("; ");
    let humorStr = reg.humor.humorSelecionados.join(", ");
    let sinaisStr = reg.sinais.join(", ");
    let autocuidadoStr = reg.autocuidado.join(", ");
    histDiv.innerHTML += `
    <div class="history-card">
      <b>${reg.data}</b><br>
      <b>Sono:</b> ${reg.sono.horasSono}h, dormiu ${reg.sono.horaDormir}, acordou ${reg.sono.horaAcordar}, qualidade: ${reg.sono.qualidadeSono} ${reg.sono.dif.length > 0 ? "(" + reg.sono.dif.join(", ") + ")" : ""}<br>
      <b>Medicação:</b> ${medStr}<br>
      <b>Humor:</b> ${humorStr}${reg.humor.humorDesc ? " - " + reg.humor.humorDesc : ""}<br>
      <b>Sinais de alerta:</b> ${sinaisStr || "nenhum"}<br>
      <b>Autocuidado:</b> ${autocuidadoStr || "nenhum"}<br>
      <b>Reflexão:</b> ${reg.reflexao || "—"}<br>
      <b>Gatilho & Reação:</b> ${reg.gatilho || "—"} / ${reg.reacao || "—"}
    </div>
    `;
  });
}

// Chart.js igual ao anterior...

// Função PDFMake corrigida
function exportarPDFMake() {
  let historico = JSON.parse(localStorage.getItem("historicoEstabilidade") || "[]");
  if (!historico.length) {
    alert("Nenhum registro para exportar.");
    return;
  }
  let content = [
    { text: "Estabilidade.me", style: "header" },
    { text: "Diário Emocional\n\n", style: "subheader" }
  ];
  historico.forEach(reg => {
    content.push(
      { text: `${reg.data}`, style: "date" },
      {
        style: 'block',
        table: {
          widths: ['*'],
          body: [[
            {
              stack: [
                { text: `🛏️ Sono: ${reg.sono.horasSono}h, dormiu ${reg.sono.horaDormir}, acordou ${reg.sono.horaAcordar}, qualidade: ${reg.sono.qualidadeSono}${reg.sono.dif.length > 0 ? " (" + reg.sono.dif.join(", ") + ")" : ""}`, margin: [0, 2, 0, 0] },
                { text: `💊 Medicação: ${reg.medicamentos.map(m => `${m.nome} (${m.dose}${m.obs ? ", " + m.obs : ""})`).join("; ")}`, margin: [0, 2, 0, 0] },
                { text: `😊 Humor: ${reg.humor.humorSelecionados.join(", ")}${reg.humor.humorDesc ? " - " + reg.humor.humorDesc : ""}`, margin: [0, 2, 0, 0] },
                { text: `⚠️ Sinais de alerta: ${reg.sinais.join(", ") || "nenhum"}`, margin: [0, 2, 0, 0] },
                { text: `🌱 Autocuidado: ${reg.autocuidado.join(", ") || "nenhum"}`, margin: [0, 2, 0, 0] },
                { text: `📝 Reflexão: ${reg.reflexao || "—"}`, margin: [0, 2, 0, 0] },
                { text: `🚧 Gatilho & Reação: ${reg.gatilho || "—"} / ${reg.reacao || "—"}`, margin: [0, 2, 0, 2] }
              ]
            }
          ]]
        },
        layout: {
          fillColor: function () { return '#f5eeff'; },
          hLineWidth: function () { return 0; },
          vLineWidth: function () { return 0; }
        }
      },
      { text: "", margin: [0, 0, 0, 6] }
    );
  });
  content.push(
    { text: "\nEstabilidade.me • Saúde mental com leveza 💜", style: "footer" }
  );
  let docDefinition = {
    content: content,
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        color: "#8857d4",
        alignment: "center",
        margin: [0, 0, 0, 2]
      },
      subheader: {
        fontSize: 14,
        color: "#6e659a",
        alignment: "center",
        margin: [0, 0, 0, 10]
      },
      date: {
        fontSize: 12,
        bold: true,
        color: "#8857d4",
        margin: [0, 8, 0, 2]
      },
      block: {
        margin: [0, 0, 0, 0]
      },
      footer: {
        fontSize: 11,
        color: "#8857d4",
        italics: true,
        alignment: "center"
      }
    }
    // Não coloque defaultStyle com font: 'Helvetica'
  };
  pdfMake.createPdf(docDefinition).download("estabilidademe_historico.pdf");
}

// ... resto do seu código (carregarHistorico, renderHumorChart etc.)
carregarHistorico();
renderHumorChart();
