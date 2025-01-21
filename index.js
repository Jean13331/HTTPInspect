const axios = require('axios');
const readline = require('readline');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Função para validar URL
function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Função para inspecionar cabeçalhos HTTP
async function inspectHeaders(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const headers = response.headers;

    // Análise de segurança
    return {
      'Strict-Transport-Security': headers['strict-transport-security'] || 'Não configurado',
      'X-XSS-Protection': headers['x-xss-protection'] || 'Não configurado',
      'Content-Security-Policy': headers['content-security-policy'] || 'Não configurado',
      'X-Frame-Options': headers['x-frame-options'] || 'Não configurado',
      'Referrer-Policy': headers['referrer-policy'] || 'Não configurado',
      'Permissions-Policy': headers['permissions-policy'] || 'Não configurado',
      'X-Content-Type-Options': headers['x-content-type-options'] || 'Não configurado',
      'Access-Control-Allow-Origin': headers['access-control-allow-origin'] || 'Não configurado',
      'Expect-CT': headers['expect-ct'] || 'Não configurado',
      'Informações Sensíveis': {
        Server: headers['server'] || 'Não configurado',
        'X-Powered-By': headers['x-powered-by'] || 'Não configurado',
        Via: headers['via'] || 'Não configurado',
        ETag: headers['etag'] || 'Não configurado',
        'Cache-Control': headers['cache-control'] || 'Não configurado',
        Age: headers['age'] || 'Não configurado',
      },
    };
  } catch (error) {
    return { error: error.code === 'ECONNABORTED' ? 'Tempo limite excedido.' : error.message };
  }
}

// Função para gerar um PDF com os resultados
function generatePDF(url, results) {
  const doc = new PDFDocument();

  // Criar o arquivo PDF
  const fileName = `Relatorio_${url.replace(/https?:\/\//, '').replace(/\//g, '_')}.pdf`;
  const stream = fs.createWriteStream(fileName);
  doc.pipe(stream);

  // Título
  doc.fontSize(16).text(`Resultados da inspeção para: ${url}\n`, { align: 'center' });

  if (results.error) {
    doc.fontSize(12).fillColor('red').text(`Erro: ${results.error}`);
  } else {
    doc.fontSize(14).text('\nConfigurações de Segurança:\n', { underline: true });
    Object.entries(results).forEach(([key, value]) => {
      if (key !== 'Informações Sensíveis') {
        const status = value === 'Não configurado' ? '⚠️ Ausente' : '✅ Presente';
        doc.fontSize(12).text(`- ${key}: ${value} ${status}`);
      }
    });

    doc.fontSize(14).text('\nInformações Sensíveis:\n', { underline: true });
    Object.entries(results['Informações Sensíveis']).forEach(([key, value]) => {
      doc.fontSize(12).text(`- ${key}: ${value}`);
    });
  }

  // Finalizar o PDF
  doc.end();
  console.log(`\nRelatório salvo como: ${fileName}`);
}

// Função para exibir os resultados no terminal
function displayResults(url, results) {
  console.log(`\nResultados da inspeção para: ${url}\n`);

  if (results.error) {
    console.error(`Erro: ${results.error}`);
    return;
  }

  console.log('Configurações de Segurança:');
  Object.entries(results).forEach(([key, value]) => {
    if (key !== 'Informações Sensíveis') {
      const status = value === 'Não configurado' ? '⚠️ Ausente' : '✅ Presente';
      console.log(`- ${key}: ${value} ${status}`);
    }
  });

  console.log('\nInformações Sensíveis:');
  Object.entries(results['Informações Sensíveis']).forEach(([key, value]) => {
    console.log(`- ${key}: ${value}`);
  });
}

// Configurar o readline para interagir no terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Bem-vindo ao verificador de cabeçalhos HTTP!');
rl.question('Por favor, insira a URL do site que deseja inspecionar: ', async (url) => {
  if (!url || !validateURL(url)) {
    console.error('Erro: URL inválida. Certifique-se de incluir o protocolo (http:// ou https://).');
    rl.close();
    return;
  }

  console.log(`\nConectando ao site ${url}...\n`);
  const results = await inspectHeaders(url);

  // Exibir os resultados no terminal
  displayResults(url, results);

  // Perguntar se deseja salvar em PDF
  rl.question('\nDeseja salvar os resultados como PDF? (s/n): ', (answer) => {
    if (answer.toLowerCase() === 's') {
      generatePDF(url, results);
    } else {
      console.log('\nRelatório em PDF não será gerado.');
    }
    rl.close();
  });
});
