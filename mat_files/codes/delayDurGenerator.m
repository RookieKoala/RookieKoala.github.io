% 27072020

clear;

min_time = 100;
max_time = 1000;
N_blocks = 10;
N_trials = 40;
N_cue_types = 4;
number_of_trials = (N_blocks * N_trials) / N_cue_types; % number of trials per location/cue type

expTimeDistribution = generateExpTimeDistribution(min_time, max_time, number_of_trials);

cued_timeorder = randperm(number_of_trials);
ipsi_timeorder = randperm(number_of_trials);
contra_timeorder = randperm(number_of_trials);
opp_timeorder = randperm(number_of_trials);

expTimeDistribution = expTimeDistribution';
%{
cued_timeorder = cued_timeorder';
ipsi_timeorder = ipsi_timeorder';
contra_timeorder = contra_timeorder';
opp_timeorder = opp_timeorder';
%}

csvwrite('expTimeDistribution.csv', expTimeDistribution);
