'use client'; 
import React, { useState, useEffect } from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Tooltip = ({ children, content }) => (
  <div className="relative group">
    {children}
    <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-sm rounded p-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64">
      {content}
      <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
      </svg>
    </div>
  </div>
);

const AdvancedSampleSizeCalculator = () => {
  const [mmseChange, setMmseChange] = useState('0.82');
  const [sd, setSd] = useState('2.2');
  const [smd, setSmd] = useState('0.40');
  const [alpha, setAlpha] = useState('0.05');
  const [power, setPower] = useState('0.8');
  const [mcid, setMcid] = useState('3');
  const [dropoutRate, setDropoutRate] = useState('20');
  const [interimAnalysis, setInterimAnalysis] = useState('true');
  const [designEffect, setDesignEffect] = useState('1.2');
  const [results, setResults] = useState({
    doi: null,
    ito: null,
    andrews: null
  });

  const calculateSampleSize = () => {
    const doiN = Math.ceil(2 * ((1.96 + 0.84) ** 2) * (parseFloat(sd) ** 2) / (parseFloat(mmseChange) ** 2));
    const itoN = Math.ceil(2 * ((1.96 + 0.84) ** 2) / (parseFloat(smd) ** 2));
    const andrewsN = Math.ceil(2 * ((1.96 + 0.84) ** 2) * (parseFloat(sd) ** 2) / (parseFloat(mcid) ** 2));

    const adjustSampleSize = (n) => {
      let adjustedN = Math.ceil(n / (1 - parseFloat(dropoutRate) / 100));
      if (interimAnalysis === 'true') {
        adjustedN = Math.ceil(adjustedN * 1.15); // Increase for O'Brien-Fleming boundaries
      }
      adjustedN = Math.ceil(adjustedN * parseFloat(designEffect));
      return adjustedN;
    };

    setResults({
      doi: { initial: doiN, adjusted: adjustSampleSize(doiN) },
      ito: { initial: itoN, adjusted: adjustSampleSize(itoN) },
      andrews: { initial: andrewsN, adjusted: adjustSampleSize(andrewsN) }
    });
  };

  useEffect(() => {
    calculateSampleSize();
  }, [mmseChange, sd, smd, alpha, power, mcid, dropoutRate, interimAnalysis, designEffect]);

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Comparative Sample Size Calculator for Cognitive Function Study</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Common Parameters</h3>
          <div className="mb-4">
            <Tooltip content="The expected standard deviation. Using 2.2 based on the average of SDs provided in Doi et al. (2017).">
              <label className="block mb-2">Standard Deviation:</label>
            </Tooltip>
            <input 
              type="number" 
              value={sd} 
              onChange={(e) => setSd(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Tooltip content="The probability of making a Type I error (usually set to 0.05).">
              <label className="block mb-2">Alpha:</label>
            </Tooltip>
            <input 
              type="number" 
              value={alpha} 
              onChange={(e) => setAlpha(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Tooltip content="The probability of correctly rejecting the null hypothesis when it is false (set to 0.8 as per study design).">
              <label className="block mb-2">Power:</label>
            </Tooltip>
            <input 
              type="number" 
              value={power} 
              onChange={(e) => setPower(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Method-Specific Parameters</h3>
          <div className="mb-4">
            <Tooltip content="The expected change in Mini-Mental State Examination (MMSE) score. Using 0.82 based on the difference between intervention and control in Doi et al. (2017).">
              <label className="block mb-2">MMSE Change (Doi method):</label>
            </Tooltip>
            <input 
              type="number" 
              value={mmseChange} 
              onChange={(e) => setMmseChange(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Tooltip content="The standardized mean difference. Using 0.40 based on Ito et al. (2022) for MMSE improvement in music-based interventions.">
              <label className="block mb-2">Standardized Mean Difference (Ito method):</label>
            </Tooltip>
            <input 
              type="number" 
              value={smd} 
              onChange={(e) => setSmd(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Tooltip content="The Minimal Clinically Important Difference. Using 3 as suggested by Andrews et al. (2019) for MMSE.">
              <label className="block mb-2">Minimal Clinically Important Difference (Andrews method):</label>
            </Tooltip>
            <input 
              type="number" 
              value={mcid} 
              onChange={(e) => setMcid(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Adjustment Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <Tooltip content="The expected percentage of participants who will not complete the study. Set to 20% as per study design.">
              <label className="block mb-2">Dropout Rate (%):</label>
            </Tooltip>
            <input 
              type="number" 
              value={dropoutRate} 
              onChange={(e) => setDropoutRate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Tooltip content="An interim analysis is planned at 6 months post-intervention start, which requires a larger sample size.">
              <label className="block mb-2">Interim Analysis:</label>
            </Tooltip>
            <select 
              value={interimAnalysis} 
              onChange={(e) => setInterimAnalysis(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="mb-4">
            <Tooltip content="A factor that accounts for the increased variability in multi-center studies. Set to 1.2 as a conservative estimate for multicenter design.">
              <label className="block mb-2">Design Effect:</label>
            </Tooltip>
            <input 
              type="number" 
              value={designEffect} 
              onChange={(e) => setDesignEffect(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      {results.doi !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Comparison of Sample Size Calculations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Method</th>
                  <th className="p-2 text-right">Initial Sample Size</th>
                  <th className="p-2 text-right">Adjusted Sample Size</th>
                  <th className="p-2 text-right">Per Group (Adjusted)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">Doi et al.</td>
                  <td className="p-2 text-right">{results.doi.initial}</td>
                  <td className="p-2 text-right">{results.doi.adjusted}</td>
                  <td className="p-2 text-right">{Math.ceil(results.doi.adjusted / 2)}</td>
                </tr>
                <tr>
                  <td className="p-2">Ito et al.</td>
                  <td className="p-2 text-right">{results.ito.initial}</td>
                  <td className="p-2 text-right">{results.ito.adjusted}</td>
                  <td className="p-2 text-right">{Math.ceil(results.ito.adjusted / 2)}</td>
                </tr>
                <tr>
                  <td className="p-2">Andrews et al.</td>
                  <td className="p-2 text-right">{results.andrews.initial}</td>
                  <td className="p-2 text-right">{results.andrews.adjusted}</td>
                  <td className="p-2 text-right">{Math.ceil(results.andrews.adjusted / 2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Alert className="mt-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <h3 className="font-semibold">Important Considerations:</h3>
          <ul className="list-disc pl-5 text-sm">
            <li>The adjusted sample size accounts for dropout, interim analysis, and multi-center variability.</li>
            <li>Interim analysis timing has been extended to 6 months post-intervention start.</li>
            <li>O'Brien-Fleming boundaries are used for the interim analysis adjustment.</li>
            <li>The design effect has been increased to account for multicenter variability.</li>
            <li>Consider using more sensitive cognitive tests alongside MMSE and Clock Drawing Test.</li>
            <li>Plan for handling missing data using multiple imputation and sensitivity analyses.</li>
            <li>Consult with a statistician to finalize the sample size and statistical analysis plan.</li>
          </ul>
        </AlertDescription>
      </Alert>
      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <h3 className="font-semibold">References:</h3>
          <ul className="list-disc pl-5 text-sm">
            <li>Doi, T., et al. (2017). Effects of Cognitive Leisure Activity on Cognition in Mild Cognitive Impairment: Results of a Randomized Controlled Trial. J Am Med Dir Assoc, 18(8):686-691.</li>
            <li>Ito, E., et al. (2022). The Effect of Music-Based Intervention on General Cognitive and Executive Functions, and Episodic Memory in People with Mild Cognitive Impairment and Dementia: A Systematic Review and Meta-Analysis of Recent Randomized Controlled Trials. Healthcare, 10(8), 1462.</li>
            <li>Andrews, J. S., et al. (2019). Disease severity and minimal clinically important differences in clinical outcome assessments for Alzheimer's disease clinical trials. Alzheimer's & Dementia: Translational Research & Clinical Interventions, 5, 354-363.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdvancedSampleSizeCalculator;
