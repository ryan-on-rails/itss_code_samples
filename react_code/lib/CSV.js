import Papa from 'papaparse'

export const parseJSON = (data) => {
  return Papa.unparse(data, { qoutes: true })
}

export const sendDownload = (csv, filename) => {
  const blob = new Blob([csv]);
  const a = window.document.createElement('a')
  a.href = window.URL.createObjectURL(blob, {type: 'text/plain'})
  a.download = filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
