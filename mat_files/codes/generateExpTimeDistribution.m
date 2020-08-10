function expTimeDistribution = generateExpTimeDistribution(minTime, maxTime, num, inclusionRatio)

if nargin<4
    inclusionRatio=0.95;
end

% Calculate the parameter lambda (L) for exponential distribution using
% inclusionRatio. 
% CDF = 1 - exp(-L*x); 
% CDF must amount to inclusionRatio for x=0...(maxTime-minTime);
% So mu=ln(1-inclusionRatio)/(minTime-maxTime);
% seed = seed + 1; 
rng(10); %14, 37
% disp(seed); 
mu=1/(log(1-inclusionRatio)/(minTime-maxTime));
mu = mu*1.3; % To make sure that the histogram falls slowly so that we get some a considerable number of trials with longer delays also

expTimeDistribution=zeros(num, 1);
k=0;
while k<num
    randTime=exprnd(mu) + minTime;
    if randTime<=maxTime
        k=k+1;
        expTimeDistribution(k)=randTime;
    end
end
histogram(expTimeDistribution);
end
