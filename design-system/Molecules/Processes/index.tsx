import React from 'react';
import { FaCheck } from 'react-icons/fa';

import { Icon } from '@/Atoms/Icon';

import { useAppSelector } from '@/redux/hooks';
import { ProcessData } from '@/redux/processes/types';

const ProcessProgress = () => {
  const DeploymentProcess = useAppSelector(
    (state) => state.processes.DeploymentProcess,
  );

  const PurchaseProcess = useAppSelector(
    (state) => state.processes.PurchaseProcess,
  );

  return (
    <div className="pr-8">
      <nav className="max-w-md">
        <h3 className="mb-4 text-2xl font-black">Steps</h3>

        <ProcessSteps processData={DeploymentProcess} />
      </nav>
    </div>
  );
};

export default ProcessProgress;

type ProcessStepsType = {
  processData: ProcessData[];
};

const ProcessSteps = ({ processData }: ProcessStepsType) => {
  const getPipeClass = (item: ProcessData) =>
    [
      'w-0.5 h-full',
      'absolute top-4 left-4',
      '-ml-px mt-0.5',
      item.progress === 2 ? 'bg-black' : 'bg-gray-300',
    ].join(' ');

  const getCircleClass = (item: ProcessData) =>
    [
      'relative',
      'flex items-center justify-center',
      'w-8 h-8',
      'border-2',
      'rounded-full',
      'border-gray-300 group-hover:border-gray-400',
      item.progress === 2
        ? 'bg-black group-hover:bg-gray-800'
        : 'bg-white border-2',
    ].join(' ');

  const getIconBlinkClass = (item: ProcessData) =>
    [
      'text-white',
      'rounded-full',
      item.progress === 1 && 'bg-black animate-ping h-1.5 w-1.5',
      item.progress === 2 && 'w-5 h-5',
    ].join(' ');

  const getBodyClass = (item: ProcessData) =>
    [
      'flex flex-col',
      'font-Roboto',
      'min-w-0',
      'ml-4',
      'hover:text-gray-700',
      item.progress === 0 && 'text-gray-500',
      (item.progress === 1 || item.progress === 2) && 'text-black',
    ].join(' ');

  return (
    <ol className="overflow-hidden">
      {processData.map((item) => {
        return (
          <li key={item.title} className="relative pb-10">
            {!item.lastStep && <div className={getPipeClass(item)} />}

            <div className="relative flex items-start group">
              <span className="flex items-center h-9">
                <span className={getCircleClass(item)}>
                  {item.progress === 0 ? (
                    <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                  ) : (
                    <Icon className={getIconBlinkClass(item)} icon={FaCheck} />
                  )}
                </span>
              </span>

              <span className={getBodyClass(item)}>
                <span className="text-xs font-semibold tracking-wide uppercase">
                  {item.title}
                </span>
                <span className="text-sm">{item.description}</span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};