import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          setTableData(data);
          setLoading(false);
        } catch (err) {
          setError('Excel dosyası okunurken bir hata oluştu. Lütfen doğru formatta bir dosya yüklediğinizden emin olun.');
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Dosya okuma hatası oluştu.');
        setLoading(false);
      };

      reader.readAsBinaryString(file);
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50"
          disabled={loading}
        />
        {error && (
          <div className="mt-2 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iaz-cyan"></div>
        </div>
      )}

      {!loading && tableData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700 border-collapse min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium uppercase text-center bg-iaz-cyan text-white rounded-t-lg" colSpan="6">
                  FOREX VE HİSSE SENETLERİ
                </th>
              </tr>
              <tr>
                <th scope="col" rowSpan="2" className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase border border-gray-200 dark:border-gray-800 dark:text-white">Sembol</th>
                <th scope="col" rowSpan="2" className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase border border-gray-200 dark:text-white dark:border-gray-800">Açıklama</th>
                <th scope="col" rowSpan="2" className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase border border-gray-200 dark:border-gray-800 dark:text-white">Spread</th>
                <th scope="col" colSpan="2" className="px-6 text-center py-3 text-xs font-medium text-gray-500 uppercase border dark:border-gray-800 dark:text-white">Swap Değerleri</th>
                <th scope="col" rowSpan="2" className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase border border-gray-200 dark:border-gray-800 dark:text-white">Üç Günlük Swap</th>
              </tr>
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center border border-gray-200 dark:border-gray-800 dark:text-white">Alış</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center border border-gray-200 dark:border-gray-800 dark:text-white">Satış</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tableData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-800 dark:text-gray-200">{row.Sembol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-200">{row.Açıklama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-200">{row.Spread}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-200">{row.Alış}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-200">{row.Satış}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-200">{row['Üç Günlük Swap']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelTable; 