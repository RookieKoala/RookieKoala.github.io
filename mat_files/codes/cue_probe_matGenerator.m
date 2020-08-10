% 26072020
% to pre-compute the cue and probe locations across trials.
clear;

N_trials = 40;
N_blocks = 10;

combi = [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44];
% cue*10 + probe
N_combi = size(combi, 2);
combi_counter(N_combi) = 0;

combi_limit = (N_trials * N_blocks) / N_combi;

for i = 1 : N_trials*N_blocks
    cue = randi([1 4]);
    probe = randi([1 4]);
    while combi_counter(find(combi == (cue*10 + probe))) >= combi_limit
        cue = randi([1 4]);
        probe = randi([1 4]);
    end
    combi_counter(combi == (cue*10 + probe)) = combi_counter(combi == (cue*10 + probe)) + 1;
    cue_probe_table(i,1) = cue-1;
    cue_probe_table(i,2) = probe-1;
end

% csvwrite('cue_probe_table.csv', cue_probe_table);